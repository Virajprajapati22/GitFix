class TreeNode {
    constructor(data) {
        this.data = data;
        this.id = TreeNode.generateId();
        this.children = [];
    }

    static generateId() {
        if (!this.currentId) {
            this.currentId = 1;
        } else {
            this.currentId++;
        }
        return this.currentId;
    }

    addChild(data) {
        const childNode = new TreeNode(data);
        this.children.push(childNode);
        return childNode;
    }

    removeChildById(id) {
        this.children = this.children.filter(child => child.id !== id);
    }

    findNodeById(id) {
        if (this.id === id) {
            return this;
        }
        for (let child of this.children) {
            const result = child.findNodeById(id);
            if (result) {
                return result;
            }
        }
        return null;
    }
}