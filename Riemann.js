var Graph = {
    equationString: "<math>",
    prevEquationString: "<math>",
    equationNumString: "<math>",
    prevEquationNumString: "<math>",
    equationDenomString: "<math>",
    prevEquationDenomString: "<math>",
    equationExpString: "<math>",
    prevEquationExpString: "<math>",
    lastAppendedMath: [],
    lastAppendedMathNum: [],
    lastAppendedMathExp: [],
    lastAppendedMathDenom: [],
    equationToEval: "",
    equationNumToEval: "",
    equationDenomToEval: "",
    equationExpToEval: "",
    minX: -10,
    maxX: 22, //not used yet, will need for zoom
    widthx: 0,
    widthy: 0,
    resolution: 1,
    lastPressed: [],
    lastPressedNum: [],
    lastPressedDenom: [],
    lastPressedExp: [],
    initialDistanceFromOrigin: 10000,
    scale: 1,
    keypressCount: 0,
    keypressNumCount: 0,
    keypressExpCount: 0,
    keypressDenomCount: 0,
    numGraphDrawn: 0,
    yAxisPosition: 0,
    xAxisPosition: 0,
    leftSumValue: 0,
    rightSumValue: 0,
    integralValue: 0,
    denom: false,
    denomCount: 0,
    expBool: false,
    keypressBaseExpCount: 0,
    lastPressedBaseExp: [],
    equationBaseExpToEval: "",
    equationBaseExpString: "",
    lastAppendedMathBaseExp: [],
    expCount: 0,

    init: function() {

        Graph.drawGraphAxis();
        $('#graphButton').click(function() {
            //need to create a function to validate user input
            try {
                math.parse(Graph.equationToEval);
                Graph.clearGraph();
                Graph.drawGraphAxis();
                $('#leftSum').empty();
                $('#rightSum').empty();
                $('#integral').empty();
                $('#equationList').empty();
                Graph.createEquation();
                Graph.drawGraph();
            } catch (e) {
                //change this to be below the equation in red text
                alert("Error processing math...", "We've encountered an error when attempting to process the equation that you input.  Please confirm that the input is correct.  The following error was reported:  " + e, "error");
            }


        });
        $('#clearButton').click(function() {
            Graph.clearGraph();
            Graph.drawGraphAxis();
            $('#leftSum').empty();
            $('#rightSum').empty();
            $('#integral').empty();
            $('#equationList').empty();
        });
        $('#equationInput').on('input', function(e) {
            Graph.equationToEval = $('#equationInput').val();
            MathJax.Hub.Queue(["Text", MathJax.Hub.getAllJax(document.getElementById('equationFormatShown'))[0], 'f(x)=' + Graph.equationToEval]);
        });

        $(document).keydown(function(e) {
            var plot = document.getElementsByTagName('symbol')[1];
            var box = plot.getAttribute('viewBox');
            if ($('#graphContainer').is(":focus")) {
                if ((e.which == 38) && e.shiftKey) {
                    console.log("afdas");
                    var use = document.getElementsByTagName('use')[0];
                    Graph.scale++;

                    use.setAttribute('transform', 'translate(' + (-250 * (Graph.scale - 1)) + ',' + (-250 * (Graph.scale - 1)) + ') scale(' + Graph.scale + ')');
                } else if ((e.which == 40) && e.shiftKey) {
                    console.log("afdas");
                    var use = document.getElementsByTagName('use')[0];
                    if (Graph.scale > 1) {
                        Graph.scale--;
                    }
                    use.setAttribute('transform', 'translate(' + (-250 * (Graph.scale - 1)) + ',' + (-250 * (Graph.scale - 1)) + ') scale(' + Graph.scale + ')');
                } else if (e.which == 37) {

                    boxVal = box.split(" ");
                    boxVal[0] = parseFloat(boxVal[0]) + Graph.width; //10;//Graph.scale;
                    plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
                    Graph.updateAxisVals(37);
                } else if (e.which == 38) {
                    boxVal = box.split(" ");
                    boxVal[1] = parseFloat(boxVal[1]) + Graph.width; //10;//Graph.scale;
                    plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
                    Graph.updateAxisVals(38);
                    e.preventDefault();
                } else if (e.which == 39) {
                    boxVal = box.split(" ");
                    boxVal[0] = parseFloat(boxVal[0]) - Graph.width; //10;//Graph.scale;
                    plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
                    Graph.updateAxisVals(39);

                } else if (e.which == 40) {
                    boxVal = box.split(" ");
                    boxVal[1] = parseFloat(boxVal[1]) - Graph.width; //10;//Graph.scale;
                    plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
                    Graph.updateAxisVals(40);
                    e.preventDefault();
                }


            }
        });

    },
    clearGraph: function() {
        var clearAxis = document.getElementById("axis");
        while (clearAxis.firstChild) {
            clearAxis.removeChild(clearAxis.firstChild);
        }

        var clearAxis = document.getElementById('graphContents');
        while (clearAxis.firstChild) {
            clearAxis.removeChild(clearAxis.firstChild);
        }

        var clearAxisLeft = document.getElementById("axisLeft");
        while (clearAxisLeft.firstChild) {
            clearAxisLeft.removeChild(clearAxisLeft.firstChild);
        }

        var clearAxisLeft = document.getElementById('leftGraphContents');
        while (clearAxisLeft.firstChild) {
            clearAxisLeft.removeChild(clearAxisLeft.firstChild);
        }

        var clearAxisIntegral = document.getElementById("axisIntegral");
        while (clearAxisIntegral.firstChild) {
            clearAxisIntegral.removeChild(clearAxisIntegral.firstChild);
        }

        var clearAxisIntegral = document.getElementById('integralGraphContents');
        while (clearAxisIntegral.firstChild) {
            clearAxisIntegral.removeChild(clearAxisIntegral.firstChild);
        }

        var clearAxisRight = document.getElementById("axisRight");
        while (clearAxisRight.firstChild) {
            clearAxisRight.removeChild(clearAxisRight.firstChild);
        }

        var clearAxisRight = document.getElementById('rightGraphContents');
        while (clearAxisRight.firstChild) {
            clearAxisRight.removeChild(clearAxisRight.firstChild);
        }
    },
    drawGraphAxis: function() {

        var svgWidth = 500;
        var svgHeight = 500;
        var use = document.getElementById('use');
        var useLeft = document.getElementById('useLeft');
        var useIntegral = document.getElementById('useIntegral');
        var useRight = document.getElementById('useRight');

        use.setAttribute('transform', 'translate(0,0) scale(1)');
        var plot = document.getElementById('graphContents');
        var plotLeft = document.getElementById('leftGraphContents');
        var plotIntegral = document.getElementById('integralGraphContents');
        var plotRight = document.getElementById('rightGraphContents');
        var box = plot.setAttribute('viewBox', '0 0 500 500');
        var boxLeft = plotLeft.setAttribute('viewBox', '0 0 500 500');
        var boxIntegral = plotIntegral.setAttribute('viewBox', '0 0 500 500');
        var boxRight = plotRight.setAttribute('viewBox', '0 0 500 500');
        var axisLines = document.getElementById('axis');
        var axisLinesLeft = document.getElementById('axisLeft');
        var axisLinesIntegral = document.getElementById('axisIntegral');
        var axisLinesRight = document.getElementById('axisRight');

        this.width = 460 / Math.abs(parseInt($('#minX').val()) - parseInt($('#maxX').val()));

        x = parseInt($('#minX').val());
        var i = 20;
        for (j = parseInt($('#minX').val()); j <= parseInt($('#maxX').val()); j++) {


            var vertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            vertical.setAttribute('d', 'M' + i + ' 20 v' + (svgHeight - 40));
            if (x != 0) {
                vertical.setAttribute('stroke-width', '.5');
            } else {
                vertical.setAttribute('stroke-width', '1');
                vertical.setAttribute('id', 'yAxisLine');
                vertical.setAttribute('stroke', 'black');
            }
            var verticalLeft = vertical.cloneNode(true);
            var verticalIntegral = vertical.cloneNode(true);
            var verticalRight = vertical.cloneNode(true);
            axisLines.appendChild(vertical);
            axisLinesLeft.appendChild(verticalLeft);
            axisLinesIntegral.appendChild(verticalIntegral);
            axisLinesRight.appendChild(verticalRight);
            //set values
            var axisVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');

            var textNode = document.createTextNode(x);
            var textNodeLeft = textNode.cloneNode(true);
            var textNodeIntegral = textNode.cloneNode(true);
            var textNodeRight = textNode.cloneNode(true);
            axisVal.setAttribute('x', i);
            axisVal.setAttribute('id', "x" + x)

            if ((Math.abs(x)) % 2 == 1) {
                axisVal.setAttribute('y', 7);
            } else {
                axisVal.setAttribute('y', 17);
            }
            axisVal.setAttribute('font-size', '7pt');
            axisVal.setAttribute('font-weight', 'lighter');
            axisVal.setAttribute('text-anchor', 'middle');
            axisVal.setAttribute('vector-effect', 'non-scaling-stroke');

            var axisValLeft = axisVal.cloneNode(true);
            var axisValIntegral = axisVal.cloneNode(true);
            var axisValRight = axisVal.cloneNode(true);
            axisVal.appendChild(textNode);
            axisLines.appendChild(axisVal);

            axisValLeft.appendChild(textNodeLeft);
            axisLinesLeft.appendChild(axisValLeft);

            axisValIntegral.appendChild(textNodeIntegral);
            axisLinesIntegral.appendChild(axisValIntegral);

            axisValRight.appendChild(textNodeRight);
            axisLinesRight.appendChild(axisValRight);
            x++;
            i += this.width;
        }
        //console.log(i);
        this.width = 460 / Math.abs(parseInt($('#minY').val()) - parseInt($('#maxY').val()));
        x = parseInt($('#maxY').val());
        i = 20;
        for (j = parseInt($('#maxY').val()); j >= parseInt($('#minY').val()); j--) {


            var horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            horizontal.setAttribute('d', 'M20 ' + i + ' h' + (svgHeight - 40));

            if (x != 0) {
                horizontal.setAttribute('stroke-width', '.5');
            } else {
                horizontal.setAttribute('stroke-width', '1');
                horizontal.setAttribute('id', 'xAxisLine');
                horizontal.setAttribute('stroke', 'black');
            }
            var horizontalLeft = horizontal.cloneNode(true);
            var horizontalIntegral = horizontal.cloneNode(true);
            var horizontalRight = horizontal.cloneNode(true);
            axisLines.appendChild(horizontal);
            axisLinesLeft.appendChild(horizontalLeft);
            axisLinesIntegral.appendChild(horizontalIntegral);
            axisLinesRight.appendChild(horizontalRight);
            //set values
            var axisVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            var textNode = document.createTextNode(x);
            var textNodeLeft = textNode.cloneNode(true);
            var textNodeIntegral = textNode.cloneNode(true);
            var textNodeRight = textNode.cloneNode(true);
            axisVal.setAttribute('y', i + 3.5);
            axisVal.setAttribute('x', 17);
            axisVal.setAttribute('id', "y" + x)
            axisVal.setAttribute('font-size', '7pt');
            axisVal.setAttribute('font-weight', 'lighter');
            axisVal.setAttribute('text-anchor', 'end');
            axisVal.setAttribute('vector-effect', 'non-scaling-stroke');
            var axisValLeft = axisVal.cloneNode(true);
            var axisValIntegral = axisVal.cloneNode(true);
            var axisValRight = axisVal.cloneNode(true);

            axisVal.appendChild(textNode);
            axisLines.appendChild(axisVal);

            axisValLeft.appendChild(textNodeLeft);
            axisLinesLeft.appendChild(axisValLeft);

            axisValIntegral.appendChild(textNodeIntegral);
            axisLinesIntegral.appendChild(axisValIntegral);

            axisValRight.appendChild(textNodeRight);
            axisLinesRight.appendChild(axisValRight);
            x--;
            i += this.width;
        }

    },

    drawGraph: function() { //bug where window isn't filled...bug where asymptotes screw things up
        Graph.numGraphDrawn++;
        var svgWidth = 500;
        var svgHeight = 500;
        var stopDraw = false;
        var high = false;
        var infinity = false;
        var low = false;
        var prevXVal = "";
        var prevYVal = "";

        this.resolution = parseInt($('#resolution').val());
        var graphContent = document.getElementById('graphContents');
        var graphContentLeft = document.getElementById('leftGraphContents');
        var graphContentIntegral = document.getElementById('integralGraphContents');
        var graphContentRight = document.getElementById('rightGraphContents');

        var xVal = parseInt($('#minX').val()); //need object variable to keep up with xVal showing in graph

        var yVal = this.evaluateEquation(xVal);
        var prevY = 0;
        this.widthx = 460 / Math.abs(parseInt($('#minX').val()) - parseInt($('#maxX').val()));
        Graph.yAxisPosition = 20 + (-1 * this.widthx * (parseInt($('#minX').val())));
        this.widthy = 460 / Math.abs(parseInt($('#minY').val()) - parseInt($('#maxY').val()));
        Graph.xAxisPosition = 20 + (this.widthy * (parseInt($('#maxY').val())));
        if (isFinite(yVal)) {
            var path = "M20 " + (Graph.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
        } else {
            path = "M20 " + (Graph.xAxisPosition - parseFloat(parseInt($('#maxY').val()) * this.widthy) * 20) + " ";
        }

        for (var i = (20); i <= (svgWidth - 20); i += this.widthx) {
            for (var j = 1; j <= this.resolution; j++) {
                var image = document.createElementNS('http://www.w3.org/2000/svg', 'path');

                var yVal = this.evaluateEquation(xVal + (j / this.resolution));

                if ((yVal <= parseInt($('#maxY').val())) && (yVal >= parseInt($('#minY').val())) && (isFinite(yVal)) && !(isNaN(yVal))) {
                    if (infinity) {

                        infinity = false;
                        if (prevYVal > 0) {
                            path += "M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#maxY').val()) * this.widthy) + " ";
                            //console.log("M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#maxY').val()) * this.widthy) + " ");
                        } else {
                            path += "M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#minY').val()) * this.widthy) + " ";
                            //console.log("M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#minY').val()) * this.widthy) + " ");
                        }
                    }
                    if (high) {
                        high = false;
                        path += Graph.backToBelowUpper((parseInt($('#maxY').val())), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                    }
                    if (low) {
                        low = false;
                        path += Graph.backToAboveLower((parseInt($('#minY').val())), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                    }
                    if (infinity) {

                        infinity = false;
                        if (prevYVal > 0) {
                            path += "M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#maxY').val()) * this.widthy) + " ";
                            //console.log("M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#maxY').val()) * this.widthy) + " ");
                        } else {
                            path += "M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#minY').val()) * this.widthy) + " ";
                            //console.log("M" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(parseInt($('#minY').val()) * this.widthy) + " ");
                        }
                    }
                    if (!high && !low && !infinity) {
                        path += "L" + (Graph.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + (Graph.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
                    }
                } else {
                    if (isNaN(yVal)) {

                    } else if (yVal > parseInt($('#maxY').val()) && isFinite(yVal) && !high) {
                        high = true;
                        path += Graph.outsideUpperRange((parseInt($('#maxY').val())), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                    } else if (yVal < parseInt($('#minY').val()) && isFinite(yVal) && !low) {
                        path += Graph.outsideLowerRange((parseInt($('#minY').val())), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                        low = true;
                    } else if (!isFinite(yVal)) {
                        infinity = true;
                    }

                }


                prevY = yVal;
            }

            xVal++;
            console.log(xVal);
        }
        image.setAttribute('d', path);
        image.setAttribute('stroke-width', '2');
        image.setAttribute('stroke', 'red');
        image.setAttribute('fill-opacity', 0);
        image.setAttribute('vector-effect', 'non-scaling-stroke');
        var imageLeft = image.cloneNode(true);
        var imageRight = image.cloneNode(true);
        var imageIntegral = image.cloneNode(true);

        graphContent.appendChild(image);
        graphContentLeft.appendChild(imageLeft);
        graphContentIntegral.appendChild(imageIntegral);
        graphContentRight.appendChild(imageRight);
        //draw rectangles

        var N = parseInt($('#rectangles').val());
        var a = parseInt($('#a').val());
        var b = parseInt($('#b').val());
        //console.log(N + " " + a + " " + b);
        xVal = b;
        path = "M" + (20 + this.widthx * (b - parseInt($('#minX').val()))) + " " + Graph.xAxisPosition;
        for (var K = 1; K <= N; K++) {
            yVal = this.evaluateEquation(xVal);
            if (isFinite(yVal)) {
                path = path + " v" + -1 * (parseFloat(yVal * this.widthy)) + " h" + (-1 * (((this.widthx * ((b - a) / N))))) + " v" + ((parseFloat(yVal * this.widthy)));

            } else {
                if (this.evaluateEquation(xVal - .001) > 0) {
                    path = path + " v" + -1 * (parseFloat(parseInt($('#maxY').val()) * this.widthy)) + " m" + (-1 * (((this.widthx * ((b - a) / N))))) + " 0 v" + ((parseFloat(parseInt($('#maxY').val()) * this.widthy)));
                } else {
                    path = path + " v" + -1 * (parseFloat(parseInt($('#minY').val()) * this.widthy)) + " m" + (-1 * (((this.widthx * ((b - a) / N))))) + " 0 v" + ((parseFloat(parseInt($('#minY').val()) * this.widthy)));
                }
                //console.log("asymptote in sum");
            }
            xVal = xVal - ((b - a) / N);

        }
        //console.log(path);
        image2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image2.setAttribute('d', path);
        image2.setAttribute('stroke-width', '2');
        image2.setAttribute('stroke', 'blue');
        image2.setAttribute('fill-opacity', 0);
        image2.setAttribute('vector-effect', 'non-scaling-stroke');

        image2Right = image2.cloneNode(true);

        graphContent.appendChild(image2);
        graphContentRight.appendChild(image2Right);
        xVal = a;
        path = "M" + (20 + this.widthx * (a - parseInt($('#minX').val()))) + " " + Graph.xAxisPosition;
        for (var K = 1; K <= N; K++) {
            yVal = this.evaluateEquation(xVal);
            if (isFinite(yVal)) {
                path = path + " v" + -1 * (parseFloat(yVal * this.widthy)) + " h" + (this.widthx * ((b - a) / N)) + " v" + ((parseFloat(yVal * this.widthy)));

            } else {
                if (this.evaluateEquation(xVal + .001) > 0) {
                    path = path + " v" + -1 * (parseFloat(parseInt($('#maxY').val()) * this.widthy)) + " m" + (this.widthx * ((b - a) / N)) + " 0 v" + ((parseFloat(parseInt($('#maxY').val()) * this.widthy)));
                } else {
                    path = path + " v" + -1 * (parseFloat(parseInt($('#minY').val()) * this.widthy)) + " m" + (this.widthx * ((b - a) / N)) + " 0 v" + ((parseFloat(parseInt($('#minY').val()) * this.widthy)));
                }
                console.log("asymptote in sum");
            }
            xVal = xVal + ((b - a) / N);
        }
        //console.log(path);
        image3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image3.setAttribute('d', path);
        image3.setAttribute('stroke-width', '2');
        image3.setAttribute('stroke', 'Green');
        image3.setAttribute('fill-opacity', 0);
        image3.setAttribute('vector-effect', 'non-scaling-stroke');

        image3Left = image3.cloneNode(true);

        graphContent.appendChild(image3);
        graphContentLeft.appendChild(image3Left);
        //shade

        xVal = a;
        var highup = 0;
        path = "M" + (20 + this.widthx * (a - parseInt($('#minX').val()))) + " " + Graph.xAxisPosition;
        for (var K = xVal; K <= b; K += (1 / this.resolution)) {
            K = parseFloat(K.toFixed(6));

            yVal = this.evaluateEquation(K);
            if (isFinite(yVal)) {
                path += "L" + (Graph.yAxisPosition + parseFloat((K) * (this.widthx))) + " " + (Graph.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
            } else {
                path += " V" + (Graph.xAxisPosition);
                console.log("asymptote in shaded region");
            }


        }
        if (isFinite(yVal)) {
            //console.log(parseFloat(yVal * this.widthy))
            path += " v" + (parseFloat(yVal * this.widthy));
        }

        path += "z";
        image4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image4.setAttribute('d', path);
        image4.setAttribute('stroke-width', '2');
        image4.setAttribute('stroke', 'black');
        image4.setAttribute('fill-opacity', 0.5);
        image4.setAttribute('fill', '#999');
        image4.setAttribute('vector-effect', 'non-scaling-stroke');

        graphContentIntegral.appendChild(image4);
        Graph.leftSumValue = 0;
        Graph.rightSumValue = 0;
        Graph.integralValue = 0;
        Graph.leftSum();
        Graph.rightSum();
        Graph.integral();


    },
    rightSum: function() {
        var N = parseInt($('#rectangles').val());
        var a = parseInt($('#a').val());
        var b = parseInt($('#b').val());
        var xVal = b;
        var tempRight = 0;
        for (var i = 0; i < N; i++) {
            tempRight = (Graph.evaluateEquation(xVal) * ((b - a) / N));
            Graph.rightSumValue += tempRight;
            if (!isFinite(tempRight)) {
                Graph.rightSumValue = "diverges";
                break;
            }
            xVal = xVal - ((b - a) / N);
        }
        if (Graph.rightSumValue != "diverges") {
            Graph.rightSumValue = parseFloat(Graph.rightSumValue.toFixed(3));
        }
        MathJax.Hub.Queue(function() {
            if (Graph.rightSumValue != "diverges") {
                var rightSum = "<math><mstyle displaystyle='true'><msub><mi>R</mi><mi>n</mi></msub><mo>=</mo><munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>" + N + "</mi></munderover><mrow><mi>f</mi><mo></mo><mrow><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo></mrow><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></mstyle><mo>=</mo>";
                $('#rightSum').empty().append(rightSum + "<mn>" + Graph.rightSumValue + "</mn></mrow></math>" + "<br><span>where </span><math><msub><mi>x</mi><mi>i</mi></msub><mo>=</mo><mn>" + a + "</mn><mo>+</mo><mi>i</mi><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></math>");
            } else {
                $('#rightSum').empty().append("Right Sum diverges");
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        $('#rightSum').text("Right Sum:  " + Graph.rightSumValue);
    },

    leftSum: function() {
        var N = parseInt($('#rectangles').val());
        var a = parseInt($('#a').val());
        var b = parseInt($('#b').val());
        var xVal = a;
        var tempLeft = 0;
        for (var i = 0; i < N; i++) {
            tempLeft = (Graph.evaluateEquation(xVal) * ((b - a) / N));
            Graph.leftSumValue += parseFloat(tempLeft.toFixed(6));
            if (!isFinite(tempLeft)) {
                Graph.leftSumValue = "diverges";
                break;
            }
            xVal = xVal + ((b - a) / N);
        }
        if (Graph.leftSumValue != "diverges") {
            Graph.leftSumValue = parseFloat(Graph.leftSumValue.toFixed(3));
        }
        MathJax.Hub.Queue(function() {
            if (Graph.leftSumValue != "diverges") {
                var leftSum = "<math><mstyle displaystyle='true'><msub><mi>L</mi><mi>n</mi></msub><mo>=</mo><munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>" + N + "</mn></munderover><mrow><mi>f</mi><mo></mo><mrow><mo>(</mo><msub><mi>x</mi><mrow><mi>i</mi><mo>&#x2212;</mo><mn>1</mn></mrow></msub><mo>)</mo></mrow><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></mstyle><mo>=</mo>";
                $('#leftSum').empty().append(leftSum + "<mn>" + Graph.leftSumValue + "</mn></mrow></math>" + "<br><span>where </span><math><msub><mi>x</mi><mi>i</mi></msub><mo>=</mo><mn>" + a + "</mn><mo>+</mo><mi>i</mi><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></math>");
            } else {
                $('#leftSum').empty().append("Left Sum diverges");
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    },

    integral: function() {
        var N = parseInt($('#rectangles').val());
        var a = parseInt($('#a').val());
        var b = parseInt($('#b').val());
        var xVal = b;
        var size = 500;
        var tempY = 0;
        var prevYVal = 0;
        for (var i = 0; i < size * (b - a); i++) {
            tempY = (Graph.evaluateEquation(xVal) * (1 / size));

            // Graph.integralValue += parseFloat(tempY.toFixed(6));
            // xVal = xVal - (1 / size);
            if (i > 0) {
                if (!isFinite(tempY)) {
                    //Graph.integralValue = "diverges";
                    break;
                } else if (Math.abs((tempY - prevYVal) / (1 / size)) >= 999999) {
                    Graph.integralValue = "diverges";
                    break;
                } else {
                    Graph.integralValue += parseFloat(tempY.toFixed(6));

                }
            } else {
                if (isFinite(tempY) && !isNaN(tempY)) {
                    Graph.integralValue += parseFloat(tempY.toFixed(6));

                } else if (isNaN(tempY)) {
                    Graph.integralValue += parseFloat(Graph.evaluateEquation(xVal - (1 / (size * 100))) * (1 / size));
                }
            }
            xVal = xVal - (1 / size);
            prevYVal = tempY;
        }

        tempY = 0;
        var prevYVal = 0;
        var temporary = 0;
        xVal = a;
        if (Graph.integralValue != "diverges") {
            for (var i = 0; i < size * (b - a); i++) {
                tempY = (Graph.evaluateEquation(xVal) * (1 / size));

                // temporary += parseFloat(tempY.toFixed(6));
                // xVal = xVal + (1 / size);
                if (i > 0) {
                    if (!isFinite(tempY)) {
                        //Graph.integralValue = "diverges";
                        break;
                    } else if (Math.abs((tempY - prevYVal) / (1 / size)) >= 999999) {
                        Graph.integralValue = "diverges";
                        break;
                    } else {
                        temporary += parseFloat(tempY.toFixed(6));

                    }
                } else {
                    if (isFinite(tempY) && !isNaN(tempY)) {

                        temporary += parseFloat(tempY.toFixed(6));

                    } else if (isNaN(tempY)) {
                        temporary += parseFloat(Graph.evaluateEquation(xVal - (1 / (size * 100))) * (1 / size));
                    }
                }
                xVal = xVal + (1 / size);
                prevYVal = tempY;
            }
        }
        console.log(Graph.integralValue + "    " + temporary);
        if (Graph.integralValue != "diverges") {
            Graph.integralValue = (Graph.integralValue + temporary) / 2;

            Graph.integralValue = parseFloat(Graph.integralValue.toFixed(3));
        }
        MathJax.Hub.Queue(function() {
            if (Graph.integralValue != "diverges") {
                $('#integral').empty().append("`int_(" + a + ")^(" + b + ")" + Graph.equationToEval + " dx = " + Graph.integralValue + "`");
            } else {
                $('#integral').empty().append("`int_(" + a + ")^(" + b + ")" + Graph.equationToEval + " dx `" + " " + Graph.integralValue);
            }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    },

    createEquation: function() {
        MathJax.Hub.Queue(function() { document.getElementById('equationList').innerHTML = "`f(x)=" + Graph.equationToEval + "`" });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    },

    outsideUpperRange: function(upper, xVal, step) {

        for (var i = xVal - step; i > xVal - (1 / Graph.resolution); i -= step) {
            tempY = Graph.evaluateEquation(i);
            if (tempY <= upper) {

                return "L" + (Graph.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (Graph.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";


    },

    outsideLowerRange: function(lower, xVal, step) {
        for (var i = xVal - step; i > xVal - (1 / Graph.resolution); i -= step) {
            tempY = Graph.evaluateEquation(i);
            if (tempY >= lower) {

                return "L" + (Graph.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (Graph.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";
    },

    backToBelowUpper: function(upper, xVal, step) {
        for (var i = xVal - ((1 / Graph.resolution) + (1 / Graph.resolution) / 10); i < xVal; i += step) {
            tempY = Graph.evaluateEquation(i);
            //console.log(xVal);
            //console.log(i);
            if (tempY <= upper) {
                //console.log(i + " " + tempY);
                return "M" + (Graph.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (Graph.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";
    },

    backToAboveLower: function(lower, xVal, step) {
        for (var i = xVal - (1 / Graph.resolution); i < xVal; i += step) {

            tempY = Graph.evaluateEquation(i);

            if (tempY >= lower) {

                return "M" + (Graph.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (Graph.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";
    },

    evaluateEquation: function(x) {
        return parseFloat(parseFloat(math.eval(((Graph.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
    },

    updateAxisVals: function(direct) {
        switch (direct) {
            case 37:
                var curVal = parseInt($('#minX').val());
                curVal++;
                document.getElementById('minX').value = curVal;
                var curVal = parseInt($('#maxX').val());
                curVal++;
                document.getElementById('maxX').value = curVal;

                break;
            case 38:
                var curVal = parseInt($('#minY').val());
                curVal--;
                document.getElementById('minY').value = curVal;
                var curVal = parseInt($('#maxY').val());
                curVal--;
                document.getElementById('maxY').value = curVal;
                break;
            case 39:
                var curVal = parseInt($('#minX').val());
                curVal--;
                document.getElementById('minX').value = curVal;
                var curVal = parseInt($('#maxX').val());
                curVal--;
                document.getElementById('maxX').value = curVal;
                break;
            case 40:
                var curVal = parseInt($('#minY').val());
                curVal++;
                document.getElementById('minY').value = curVal;
                var curVal = parseInt($('#maxY').val());
                curVal++;
                document.getElementById('maxY').value = curVal;
                break;
            default:
                console.log("Encountered an error updating Axis Values");


        }
        Graph.clearGraph();
        Graph.drawGraphAxis();
        if (Graph.numGraphDrawn > 0) {
            Graph.drawGraph();
        }

    }

}

$(document).ready(function() {
    Graph.init();
});
