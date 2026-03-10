import figma from 'figma-api';

// Figma API 토큰을 환경 변수에서 가져오거나 직접 설정
const FIGMA_TOKEN = process.env.FIGMA_TOKEN || 'YOUR_FIGMA_TOKEN_HERE';

const figmaApi = new figma.Client({
  personalAccessToken: FIGMA_TOKEN
});

export const getFigmaNode = async (fileKey, nodeId) => {
  try {
    // 파일 정보 가져오기
    const fileResponse = await figmaApi.file(fileKey);
    
    // 노드 ID 파싱 (예: "1-3" 형태)
    const [nodePageId, nodeObjectId] = nodeId.split('-');
    
    // 페이지에서 노드 찾기
    const page = fileResponse.data.document.children.find(page => 
      page.id === nodePageId
    );
    
    if (!page) {
      throw new Error(`Page with ID ${nodePageId} not found`);
    }
    
    // 노드 찾기
    const findNode = (nodes, targetId) => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    
    const node = findNode(page.children, nodeId);
    
    if (!node) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }
    
    return {
      fileKey,
      nodeId,
      nodeType: node.type,
      name: node.name,
      absoluteBoundingBox: node.absoluteBoundingBox,
      children: node.children || [],
      styles: node.styles || {},
      fills: node.fills || [],
      strokes: node.strokes || [],
      effects: node.effects || [],
      characters: node.characters || '',
      style: node.style || {},
      layoutMode: node.layoutMode || 'NONE',
      primaryAxisSizingMode: node.primaryAxisSizingMode || 'AUTO',
      counterAxisSizingMode: node.counterAxisSizingMode || 'AUTO',
      primaryAxisAlignItems: node.primaryAxisAlignItems || 'MIN',
      counterAxisAlignItems: node.counterAxisAlignItems || 'MIN'
    };
    
  } catch (error) {
    console.error('Error fetching Figma node:', error);
    throw error;
  }
};

export const getFigmaFile = async (fileKey) => {
  try {
    const response = await figmaApi.file(fileKey);
    return response.data;
  } catch (error) {
    console.error('Error fetching Figma file:', error);
    throw error;
  }
};

export const getFigmaFileNodes = async (fileKey, nodeIds) => {
  try {
    const response = await figmaApi.fileNodes(fileKey, nodeIds.join(','));
    return response.data;
  } catch (error) {
    console.error('Error fetching Figma file nodes:', error);
    throw error;
  }
};