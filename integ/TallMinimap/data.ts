import { DiagramMakerData, EditorMode, PositionAnchor } from 'diagram-maker';

export const graph: DiagramMakerData<{}, {}> = {
  nodes: {
    node1: {
      id: 'node1',
      diagramMakerData: {
        position: { x: 200, y: 150 },
        size: { width: 100, height: 50 }
      }
    },
    node2: {
      id: 'node2',
      diagramMakerData: {
        position: { x: 400, y: 300 },
        size: { width: 100, height: 50 }
      }
    }
  },
  edges: {
    edge1: {
      id: 'edge1',
      src: 'node1',
      dest: 'node2',
      diagramMakerData: { }
    }
  },
  panels: {
    [`library`]: {
      id: `library`,
      position: { x: 20, y: 20 },
      size: { width: 250, height: 600 },
      positionAnchor: PositionAnchor.TOP_RIGHT
    },
    [`minimap`]: {
      id: `minimap`,
      position: { x: 0, y: 0 },
      size: { width: 200, height: 150 },
      positionAnchor: PositionAnchor.TOP_LEFT
    }
  },
  plugins: {
    [`minimap`]: {
      data:{
        size: { width: 200, height: 200 }
      }
    }
  },
  workspace: {
    position: { x: 0, y: 0 },
    scale: 1,
    canvasSize: { width: 1920, height: 3840 },
    viewContainerSize: { width: window.innerWidth, height: window.innerHeight }
  },
  editor: { mode: EditorMode.DRAG }
};
