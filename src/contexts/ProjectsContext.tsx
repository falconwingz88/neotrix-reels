import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CustomProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links: string[];
  credits: string;
  createdAt: string;
}

interface ProjectsContextType {
  customProjects: CustomProject[];
  addProject: (project: Omit<CustomProject, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Omit<CustomProject, 'id' | 'createdAt'>) => void;
  deleteProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'neotrix_custom_projects';

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [customProjects, setCustomProjects] = useState<CustomProject[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects));
  }, [customProjects]);

  const addProject = (project: Omit<CustomProject, 'id' | 'createdAt'>) => {
    const newProject: CustomProject = {
      ...project,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, project: Omit<CustomProject, 'id' | 'createdAt'>) => {
    setCustomProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...project }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setCustomProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProjectsContext.Provider value={{ customProjects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
