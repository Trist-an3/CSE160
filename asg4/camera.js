


class Camera {
    constructor() {
        this.fov = 70;
        this.eye = new Vector3([0, 0, 4]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);


        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );

        this.projMat = new Matrix4();
        this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 100);

        this.speed = 0.3;
    }

    getFOV() {
        return this.fov;
    }

    moveForward() {

        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // f = at - eye
        f.normalize(); // Normalize f

        f.mul(this.speed); // Scale f by a desired "speed" value

        this.eye.add(f);
        this.at.add(f);
    }

    moveBackwards() {
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at) // b = eye - at
        b.normalize(); // Normalize b

        b.mul(this.speed);

        this.eye.add(b);
        this.at.add(b);
    }

    moveLeft() {
        let f = new Vector3();

        f.set(this.at);
        f.sub(this.eye); // f = at - eye

        let s = Vector3.cross(this.up, f); // s = up x f
        s.normalize(); // Normalize s
        s.mul(this.speed);

        this.eye.add(s);
        this.at.add(s);
    }

    moveRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // f = at - eye

        let s = Vector3.cross(f, this.up); // s = f x up
        s.normalize(); // Normalize s
        s.mul(this.speed);

        this.eye.add(s);
        this.at.add(s);
    }

    panLeft(alpha) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // f = at - eye

        let rotationMat = new Matrix4();
        rotationMat.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let f_prime = rotationMat.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    panRight(alpha) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // f = at - eye

        let rotationMat = new Matrix4();
        rotationMat.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let f_prime = rotationMat.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    moveUp() {
        this.eye.elements[1] += 1;
        this.at.elements[1] += 1;
    }

    moveDown() {
        if(this.eye.elements[1] < 1) {
            this.eye.elements[1] = 0;
            this.at.elements[1] = 0;
        } else {
            this.eye.elements[1] -= 1;
            this.at.elements[1] -= 1;
        }
    }

    lookUp(alpha) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // f = at - eye
        let right = Vector3.cross(f, this.up).normalize();

        let rotationMat = new Matrix4();
        rotationMat.setRotate(alpha, right.elements[0], right.elements[1], right.elements[2]);

        let f_prime = rotationMat.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    lookDown(alpha) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // f = at - eye
        let right = Vector3.cross(f, this.up).normalize();

        let rotationMat = new Matrix4();
        rotationMat.setRotate(-alpha, right.elements[0], right.elements[1], right.elements[2]);

        let f_prime = rotationMat.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    zoomIn() {
        if(this.fov > 20) {
            this.fov -= 5;
            this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 100);
        }
    }

    zoomOut() {
        if(this.fov < 100) {
            this.fov += 5;
            this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 100);
        }
    }

}
