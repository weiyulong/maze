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
        //初始化岔路口集合
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
                    //记录当前岔路坐标
                    fork.push(here);
                }
                //前进到选的的路径
                here = next;
                total--;
            } else {
                //返回上一个岔路口
                here = fork.pop();
            }
        }
    }
    //以文本的形式输出
    text(decrypt = false, start = [1, 1], end = [this.w, this.h]) {
        let strArr = [];
        let path = this.seek(start, end);
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
                            if (x == 0) {
                                lines[x] = '┣';
                            } else if (x == this.w * 2) {
                                lines[x] = '┫';
                            } else if (y == 0) {
                                lines[x] = '┳';
                            } else if (y == this.h * 2) {
                                lines[x] = '┻';
                            } else {
                                lines[x] = '╋';
                            }
                        }
                    } else {
                        lines[x] = this.horiz[y / 2][(x - 1) / 2] ? '　' : '━';
                    }
                }
            } else {
                for (let x = 0; x < this.w * 2 + 1; x++) {
                    if (x % 2 == 0) {
                        lines[x] = this.verti[x / 2][(y - 1) / 2] ? '　' : '┃';
                    } else {
                        lines[x] = '　';
                    }
                }
            }
            if (y % 2 && decrypt) {
                let row = path.filter(grid => grid[1] * 2 - 1 == y);
                lines = lines.map((value, index, array) => {
                    return row.some(point => point[0] * 2 - 1 == index) ? '·' : value;
                });
            }
            //if (y == 0) { lines[1] = '　'; }
            if (y == start[1] * 2 - 1) { lines[start[0] * 2 - 1] = '☆'; }
            //if (y == this.h * 2) { lines[this.w * 2 - 1] = '　'; }
            if (y == end[1] * 2 - 1) { lines[end[0] * 2 - 1] = '★'; }
            strArr.push(lines.join('') + '\r\n');
        }
        return strArr.join('');
    }
    //在画布中绘制迷宫
    draw(ele) {
        let space = 20;
        let spot = 1;
        let width = space * (this.w + 2) + spot * (this.w + 1);
        let height = space * (this.h + 2) + spot * (this.h + 1);
        let canvas = document.getElementById(ele);
        let ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.lineWidth = spot;
        ctx.beginPath();
        for (let i = 0; i < this.verti.length; i++) {
            for (let y = 0; y < this.verti[i].length; y++) {
                ctx.moveTo(space + 1 + (space + 1) * i, (space + 1) * (y + 1));
                if (!this.verti[i][y]) {
                    ctx.lineTo(space + 1 + (space + 1) * i, space + (space + 1) * (y + 1));
                }
            }
        }
        for (let i = 0; i < this.horiz.length; i++) {
            for (let x = 0; x < this.horiz[i].length; x++) {
                ctx.moveTo((space + 1) * (x + 1), space + 1 + (space + 1) * i);
                if(!this.horiz[i][x]){
                    ctx.lineTo((space + 1) * (x + 1) + space, space + 1 + (space + 1) * i);
                }
            }
        }
        ctx.stroke();
    }
    //探索迷宫唯一出路
    seek(start, end) {
        let here = [];
        let path = [];
        let fork = [];
        let back = [];
        let next = start;
        let another = [];
        do {
            let neighbors = [];
            if (path.some(point => point.toString() == next.toString())) {
                let arrived = false;
                path = path.filter((value, index) => {
                    if (value.toString() == next.toString()) {
                        arrived = true;
                        back = path[index - 1];
                    }
                    return !arrived;
                });
                for (let i in another) {
                    if (another[i].fork.toString() == next.toString()) {
                        neighbors = another[i].neighbors;
                        another.splice(i, 1);
                    }
                }
            } else {
                back = here;
                if (back.toString() != [next[0] - 1, next[1]].toString() && this.verti[next[0] - 1][next[1] - 1]) {
                    neighbors.push([next[0] - 1, next[1]]);
                }
                if (back.toString() != [next[0] + 1, next[1]].toString() && this.verti[next[0]][next[1] - 1]) {
                    neighbors.push([next[0] + 1, next[1]]);
                }
                if (back.toString() != [next[0], next[1] - 1].toString() && this.horiz[next[1] - 1][next[0] - 1]) {
                    neighbors.push([next[0], next[1] - 1]);
                }
                if (back.toString() != [next[0], next[1] + 1].toString() && this.horiz[next[1]][next[0] - 1]) {
                    neighbors.push([next[0], next[1] + 1]);
                }
            }
            here = next;
            if (neighbors.length > 1) {
                next = neighbors[Math.floor(Math.random() * neighbors.length)];
                fork.push(here);
                another.push({ fork: here, neighbors: neighbors.filter(value => value != next) });
            } else if (neighbors.length == 1) {
                next = neighbors[0];
            } else {
                next = fork.pop();
            }
            path.push(here);
        } while (here.toString() != end.toString());
        return path;
    }
}