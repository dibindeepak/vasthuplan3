import { NextRequest, NextResponse } from 'next/server';
import { ArchitecturalProject } from '@/lib/types';
import { DEFAULT_PROJECT } from '@/lib/default-project';

// In-memory persistent registry for cloud shared projects across devices
// In addition to in-memory, we also provide fallback data
declare global {
  var __ARCH_PROJECTS_CACHE__: Map<string, ArchitecturalProject> | undefined;
}

const projectsMap = global.__ARCH_PROJECTS_CACHE__ ?? new Map<string, ArchitecturalProject>();
global.__ARCH_PROJECTS_CACHE__ = projectsMap;

// Seed with default project if empty
if (!projectsMap.has(DEFAULT_PROJECT.id)) {
  projectsMap.set(DEFAULT_PROJECT.id, DEFAULT_PROJECT);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const project = projectsMap.get(id);
    if (project) {
      return NextResponse.json({ success: true, project });
    }
    return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
  }

  const list = Array.from(projectsMap.values()).map((p) => ({
    id: p.id,
    name: p.name,
    drawingNumber: p.titleBlock.drawingNumber,
    client: p.titleBlock.client,
    updatedAt: p.updatedAt,
  }));

  return NextResponse.json({ success: true, projects: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project: ArchitecturalProject = body.project;

    if (!project) {
      return NextResponse.json({ success: false, message: 'Missing project payload' }, { status: 400 });
    }

    const id = project.id || `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const updatedProject: ArchitecturalProject = {
      ...project,
      id,
      updatedAt: new Date().toISOString(),
    };

    projectsMap.set(id, updatedProject);

    return NextResponse.json({
      success: true,
      id,
      updatedAt: updatedProject.updatedAt,
      message: 'Project saved to cloud successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
