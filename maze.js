class Maze {
    constructor(w, h) {
        //初始化迷宫宽度值
        this.w = Math.abs(w) || 1;
        //初始化迷宫高度值
        this.h = Math.abs(h) || 1;
        //初始化水平线集合
        this.horiz = [];
        //初始化垂直线集合
        this.verti = [];
        //计算迷宫总格子数
        let total = this.w * this.h;
        //初始化起始点设置
        let here = [Math.floor(Math.random() * this.w) + 1, Math.floor(Math.random() * this.h) + 1];
        //初始化路径点集合
        let fork = [];
        //初始化未访问路径
        let unvisited = [];
        //水平线通行初始化
        for (let y = 0; y <= this.h; y++) {
            this.horiz[y] = [];
            for (let x = 0; x < this.w; x++) {
                this.horiz[y][x] = false;
            }
        }
        //垂直线通行初始化
        for (let x = 0; x <= this.w; x++) {
            this.verti[x] = [];
            for (let y = 0; y < this.h; y++) {
                this.verti[x][y] = false;
            }
        }
        //未访问路径集生成
        for (let x = 0; x < this.w + 2; x++) {
            unvisited[x] = [];
            for (let y = 0; y < this.h + 2; y++) {
                unvisited[x].push(x > 0 && x <= this.w && y > 0 && y <= this.h && (x != here[0] || y != here[1]));
            }
        }
        //迷宫随机路径生成
        while (total > 1) {
            //当前格的邻格集合
            let potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1], [here[0] - 1, here[1]], [here[0], here[1] - 1]];
            //可前进的邻格集合
            let neighbors = [];
            for (let i = 0; i < potential.length; i++) {
                if (unvisited[potential[i][0]][potential[i][1]]) {
                    neighbors.push(potential[i]);
                }
            }
            if (neighbors.length) {
                //随机选择前进方向
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                if (next[0] == here[0]) {
                    //打通纵向邻格通道
                    this.horiz[Math.min(here[1], next[1])][next[0] - 1] = true;
                } else {
                    //打通横向邻格通道
                    this.verti[Math.min(here[0], next[0])][next[1] - 1] = true;
                };
                //记录将前进的路径
                unvisited[next[0]][next[1]] = false;
                if (neighbors.length > 1) {
                    fork.push(here);
                }
                here = next;
                total--;
            } else {
                here = fork.pop();
            }
        }
    }
    text() {
        let strArr = [];
        for (let y = 0; y < this.h * 2 + 1; y++) {
            let lines = [];
            if (y % 2 == 0) {
                for (let x = 0; x < this.w * 2 + 1; x++) {
                    if (x % 2 == 0) {
                        if (x == 0 && y == 0) {
                            lines[x] = '┏';
                        } else if (x == this.w * 2 && y == 0) {
                            lines[x] = '┓';
                        } else if (x == 0 && y == this.h * 2) {
                            lines[x] = '┗';
                        } else if (x == this.w * 2 && y == this.h * 2) {
                            lines[x] = '┛';
                        } else {
                            if(x==0){
                                lines[x] = '┣';
                            }else if(x==this.w*2){
                                lines[x] = '┫';
                            }else if(y==0){
                                lines[x] = '┳';
                            }else if(y==this.h*2){
                                lines[x] = '┻';
                            }else{
                                lines[x] = '╋';
                            }
                        }
                    } else {
                        if (this.horiz[y / 2][(x - 1) / 2]) {
                            lines[x] = '　';
                        } else {
                            lines[x] = '━';
                        }
                    }
                }
            } else {
                for (let x = 0; x < this.w * 2 + 1; x++) {
                    if (x % 2 == 0) {
                        if (this.verti[x / 2][(y - 1) / 2]) {
                            lines[x] = '　';
                        } else {
                            lines[x] = '┃';
                        }
                    } else {
                        lines[x] = '　';
                    }
                }
            }
            if (y == 0) { lines[1] = '　'; }
            if (y == 1) { lines[1] = '☆'; }
            if (y == this.h * 2) { lines[this.w * 2 - 1] = '　'; }
            if (y == this.h * 2 - 1) { lines[this.w * 2 - 1] = '★'; }
            strArr.push(lines.join('') + '\r\n');
        }
        return strArr.join('');
    }
}