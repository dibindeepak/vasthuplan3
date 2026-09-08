import { NextRequest, NextResponse } from 'next/server';
import { ArchitecturalProject } from '@/lib/types';
import { DEFAULT_PROJECT } from '@/lib/default-project';

declare global {
  var __ARCH_PROJECTS_CACHE__: Map<string, ArchitecturalProject> | undefined;
}

const projectsMap = global.__ARCH_PROJECTS_CACHE__ ?? new Map<string, ArchitecturalProject>();
global.__ARCH_PROJECTS_CACHE__ = projectsMap;

if (!projectsMap.has(DEFAULT_PROJECT.id)) {
  projectsMap.set(DEFAULT_PROJECT.id, DEFAULT_PROJECT);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = projectsMap.get(id);

  if (!project) {
    return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedProject: ArchitecturalProject = {
      ...body.project,
      id,
      updatedAt: new Date().toISOString(),
    };

    projectsMap.set(id, updatedProject);

    return NextResponse.json({
      success: true,
      id,
      updatedAt: updatedProject.updatedAt,
      message: 'Project synced to cloud',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}
