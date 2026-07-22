import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { useAuth } from "@/contexts/AuthContext";

export interface CustomProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links: string[];
  credits: string;
  thumbnail?: string;
  fileLink?: string;
  year?: number;
  client?: string;
  projectStartDate?: string;
  deliveryDate?: string;
  createdAt: string;
  sortOrder?: number;
  isRestricted?: boolean;
}

interface ProjectsContextType {
  customProjects: CustomProject[];
  addProject: (project: Omit<CustomProject, "id" | "createdAt">) => Promise<void>;
  updateProject: (id: string, project: Partial<Omit<CustomProject, "id" | "createdAt">>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (projectId: string, direction: "up" | "down") => Promise<void>;
  reorderProjectsByIds: (orderedIds: string[]) => Promise<void>;
  initializeDefaultProjects: () => Promise<void>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  links: string[] | null;
  credits: string | null;
  thumbnail: string | null;
  file_link: string | null;
  year: string | null;
  client: string | null;
  project_start_date: string | null;
  delivery_date: string | null;
  created_at: string;
  sort_order: number | null;
  is_restricted: boolean | null;
};

export const projectFromRow = (row: ProjectRow): CustomProject => ({
  id: row.id,
  title: row.title,
  description: row.description || "",
  tags: row.tags || [],
  links: row.links || [],
  credits: row.credits || "",
  thumbnail: row.thumbnail || undefined,
  fileLink: row.file_link || undefined,
  year: row.year ? Number.parseInt(row.year, 10) : undefined,
  client: row.client || undefined,
  projectStartDate: row.project_start_date || undefined,
  deliveryDate: row.delivery_date || undefined,
  createdAt: row.created_at,
  sortOrder: row.sort_order ?? undefined,
  isRestricted: row.is_restricted ?? false,
});

const toRow = (project: Partial<Omit<CustomProject, "id" | "createdAt">>) => {
  const row: Record<string, unknown> = {};
  if (project.title !== undefined) row.title = project.title;
  if (project.description !== undefined) row.description = project.description;
  if (project.tags !== undefined) row.tags = project.tags;
  if (project.links !== undefined) row.links = project.links;
  if (project.credits !== undefined) row.credits = project.credits;
  if (project.thumbnail !== undefined) row.thumbnail = project.thumbnail;
  if (project.year !== undefined) row.year = project.year?.toString();
  if (project.client !== undefined) row.client = project.client;
  if (project.projectStartDate !== undefined) row.project_start_date = project.projectStartDate || null;
  if (project.deliveryDate !== undefined) row.delivery_date = project.deliveryDate || null;
  if (project.sortOrder !== undefined) row.sort_order = project.sortOrder;
  if (project.isRestricted !== undefined) row.is_restricted = project.isRestricted;
  if (project.thumbnail === undefined && project.links?.[0]) row.thumbnail = getYouTubeThumbnail(project.links[0]);
  return row;
};

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      console.error("Error fetching projects:", fetchError);
      setError("We could not load the work right now.");
    } else {
      const fileLinks = new Map<string, string>();
      if (isAdmin) {
        const { data: privateData, error: privateError } = await supabase
          .from("project_file_links")
          .select("project_id, file_link");
        if (privateError) {
          console.error("Error fetching protected project file links:", privateError);
        } else {
          for (const item of privateData || []) fileLinks.set(item.project_id, item.file_link);
        }
      }

      setCustomProjects(((data || []) as ProjectRow[]).map((row) => ({
        ...projectFromRow(row),
        fileLink: fileLinks.get(row.id),
      })));
    }
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    void fetchProjects();
    const channel = supabase
      .channel("projects-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => void fetchProjects())
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchProjects]);

  const actions = useMemo(() => ({
    addProject: async (project: Omit<CustomProject, "id" | "createdAt">) => {
      const nextSortOrder = customProjects.reduce(
        (highest, current) => Math.max(highest, current.sortOrder ?? 0),
        0,
      ) + 1;
      const { data: inserted, error: actionError } = await supabase
        .from("projects")
        .insert(toRow({ ...project, sortOrder: project.sortOrder ?? nextSortOrder }) as never)
        .select("id")
        .single();
      if (actionError) throw actionError;
      if (project.fileLink && inserted?.id) {
        const { error: fileLinkError } = await supabase.from("project_file_links").upsert({
          project_id: inserted.id,
          file_link: project.fileLink,
          updated_at: new Date().toISOString(),
        });
        if (fileLinkError) {
          await supabase.from("projects").delete().eq("id", inserted.id);
          throw fileLinkError;
        }
      }
      await fetchProjects();
    },
    updateProject: async (id: string, project: Partial<Omit<CustomProject, "id" | "createdAt">>) => {
      const { error: actionError } = await supabase.from("projects").update(toRow(project) as never).eq("id", id);
      if (actionError) throw actionError;
      if (project.fileLink !== undefined) {
        const fileLink = project.fileLink.trim();
        const fileLinkResult = fileLink
          ? await supabase.from("project_file_links").upsert({
              project_id: id,
              file_link: fileLink,
              updated_at: new Date().toISOString(),
            })
          : await supabase.from("project_file_links").delete().eq("project_id", id);
        if (fileLinkResult.error) throw fileLinkResult.error;
      }
      await fetchProjects();
    },
    deleteProject: async (id: string) => {
      const { error: actionError } = await supabase.from("projects").delete().eq("id", id);
      if (actionError) throw actionError;
      await fetchProjects();
    },
    reorderProjects: async (projectId: string, direction: "up" | "down") => {
      const currentIndex = customProjects.findIndex((project) => project.id === projectId);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= customProjects.length) return;
      const current = customProjects[currentIndex];
      const target = customProjects[targetIndex];
      const results = await Promise.all([
        supabase.from("projects").update({ sort_order: target.sortOrder ?? targetIndex + 1 }).eq("id", current.id),
        supabase.from("projects").update({ sort_order: current.sortOrder ?? currentIndex + 1 }).eq("id", target.id),
      ]);
      const actionError = results.find((result) => result.error)?.error;
      if (actionError) throw actionError;
      await fetchProjects();
    },
    reorderProjectsByIds: async (orderedIds: string[]) => {
      const previousProjects = customProjects;
      const order = new Map(orderedIds.map((id, index) => [id, index + 1]));
      setCustomProjects((current) =>
        [...current]
          .map((project) => ({ ...project, sortOrder: order.get(project.id) ?? project.sortOrder }))
          .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)),
      );

      const { error: actionError } = await supabase.rpc("reorder_projects", {
        _ordered_ids: orderedIds,
      });
      if (actionError) {
        setCustomProjects(previousProjects);
        throw actionError;
      }
      await fetchProjects();
    },
    // Supabase is now the only project source of truth; retained for admin compatibility.
    initializeDefaultProjects: fetchProjects,
  }), [customProjects, fetchProjects]);

  return (
    <ProjectsContext.Provider value={{ customProjects, loading, error, refetch: fetchProjects, ...actions }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider");
  return context;
};
