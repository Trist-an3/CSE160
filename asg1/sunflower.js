class Sunflower {
    constructor() {
        this.shapes = [];
        this.initShapes();
    }

    initShapes() {
        //branch leaf thing that connects from floor
        const branchColor = [0.0, 1.0, 0.0, 1.0]; 
        const branchSize = 15.0;
        const branchSegments = 12; 
        const branchCount = 10; 
        const branchSpacing = 0.1; 

        for (let i = 0; i < branchCount; i++) {
            const y = -0.9 + i * branchSpacing;
            const branch = new Circle();
            branch.position = [0.0, y];
            branch.color = branchColor;
            branch.size = branchSize;
            branch.segments = branchSegments;
            this.shapes.push(branch);
        }

        // 2. Petals
        const petalCount = 11; 
        const petalRadius = 0.4;
        const petalSize = 25.0; 
        const petalColor = [1.0, 1.0, 0.0, 1.0]; 

        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * 2 * Math.PI;
            const x = petalRadius * Math.cos(angle);
            const y = petalRadius * Math.sin(angle) + 0.4;
            const petal = new Point();
            petal.position = [x, y];
            petal.color = petalColor;
            petal.size = petalSize;
            this.shapes.push(petal);
        }

        // 3. Sunflower Center 
        const center = new Circle();
        center.position = [0.0, 0.4];
        center.color = [0.55, 0.27, 0.07, 1.0]; 
        center.size = 75.0;
        center.segments = 20;
        this.shapes.push(center);
    }

    render() {
        // Change background color to light blue
        gl.clearColor(0.529, 0.808, 0.922, 1.0); // Light blue background
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Render all shapes
        this.shapes.forEach((shape) => {
            shape.render();
        });
    }
}