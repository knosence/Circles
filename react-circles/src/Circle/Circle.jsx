import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Circle extends Component {
    state = {  
        isDown: false,
            previousPointX: '',
            previousPointY: '',
            base_image: {},
            circleConfig: {
                maxCircle: 4,
            },
            circles: [],
            canvasId: this.props.canvasid,
            rotate: this.props.rotate
    }
    
    render() { 
        return (
            <div>
                <canvas ref="canvas" className="CursorCanvas" width="300" height="300"
                    onMouseDown={
                        e => {
                            let nativeEvent = e.nativeEvent;
                            this.handleMouseDown(nativeEvent);
                        }}
                    onMouseMove={
                        e => {
                            let nativeEvent = e.nativeEvent;
                            this.handleMouseMove(nativeEvent);
                        }}
                    onMouseUp={
                        e => {
                            let nativeEvent = e.nativeEvent;
                            this.handleMouseUp(nativeEvent);
                        }}
                />
                <pre hidden>{JSON.stringify(this.state.circles, null, 2)}</pre>
            </div>
        );
    }

    drawCircle(circles, ctx) {
        circles.forEach((item) => {
            ctx.beginPath();
            var r = (item.endx - item.startx) / 2;
            var centerx = (r + item.startx);
            var centery = (r + item.starty);
            ctx.arc(centerx, centery, r, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        })
    }

    handleMouseDown=(event)=> {
        if (this.state.circles.length >= this.state.circleConfig.maxCircle) return;

        this.setState({
            isDown: true,
            previousPointX: event.offsetX,
            previousPointY: event.offsetY
        }, () => {
            //   console.log('mousedown',this.state)
        })
    }

    handleMouseMove=(event) =>{
        if (this.state.isDown) {
            event.preventDefault();
            event.stopPropagation();
            const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.drawImage(this.state.base_image, 0, 0);
            ctx.drawImage(this.state.base_image,
                canvas.width / 2 - this.state.base_image.width / 2,
                canvas.height / 2 - this.state.base_image.height / 2
            );
            //Save
            ctx.save();
            ctx.beginPath();
            this.drawCircle(this.state.circles, ctx);
            // var circleLength = this.state.circles.length || 0;

            //Dynamic scaling
            var scalex = (x - this.state.previousPointX) / 2;
            var scaley = (y - this.state.previousPointY) / 2;
            ctx.scale(scalex, scaley);
            //Create ellipse
            var centerx = (this.state.previousPointX / scalex) + 1;
            var centery = (this.state.previousPointY / scaley) + 1;
            ctx.beginPath();
            ctx.arc(centerx, centery, 1, 0, 2 * Math.PI);
            ctx.restore();
            ctx.stroke();
            // ctx.strokeStyle = this.state.circleConfig.color[circleLength];
            // console.log('centerx',centerx,'centery',centery)
        }

    }
    handleMouseUp=(event)=> {
        if (this.state.circles.length >= this.state.circleConfig.maxCircle) return;
        this.setState({
            isDown: false
        });
        // console.log('mouseup',this.state)
        var x = event.offsetX;
        var y = event.offsetY;

        if (this.state.previousPointX !== x && this.state.previousPointY !== y) {
            this.setState({
                circles: this.state.circles.concat({
                    startx: this.state.previousPointX,
                    starty: this.state.previousPointY,
                    endx: x,
                    endy: y,
                    r: (x - this.state.previousPointX) / 2,
                    centerx: (((x - this.state.previousPointX) / 2) + this.state.previousPointX),
                    centery: (((x - this.state.previousPointX) / 2) + this.state.previousPointY)
                    // color: this.state.circleConfig.color[circleLength]
                })
            },
                () => {
                    //console.log('mouseup', this.state);
                }
            );
        }
    }
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        const ctx = canvas.getContext("2d");
        const base_image = new Image();
        base_image.src = this.props.imgSrc
        base_image.onload = function () {
            // ctx.drawImage(base_image, 0, 0);
            ctx.drawImage(base_image,
                canvas.width / 2 - base_image.width / 2,
                canvas.height / 2 - base_image.height / 2
            );
        }
        this.setState({
            base_image: base_image
        });
    }
}
 
export default Circle;