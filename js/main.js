var util = {
    //функция генирирует целое случайное число из диапозона min max включительно
    randomInteger: function (min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
}
Function.prototype.method = function (name, func) { //  обращаемся к прототипу глобального конструктора и добавляем новый метод
    if (!this.prototype[name]) {                    //  чтобы избежать конфликта, проверяем на наличие такого имени
        this.prototype[name] = func;                //  если такого имени нет, то добавляем его объекту
        return this;
    }
}
//  определяем метод для массива
Array.method("fillIncr", function (length, start) { //  задали метод fillIncr и функцию с переменными длинна и старт
    start = start || 0;                             //  по-умолчанию, если старт небыл определен, то он равен 0
    for (var i = 0; i < length; i++) {
        this.push(i + start);                       //  добавляем в массив несколько значений
    }
    return this;
})

//  зададим методы для элементов
Array.method("popRandom", function () {             //  метод удаляет и возвращает (shift с начала, pop с конца) случайный элемент массива
    return this.splice(Math.floor(Math.random() * this.length), 1)[0];
});

Array.method("shuffle", function () {                //  метод смешивает массив случайным образом (очень качественный способ!!!)
    for (var i = 0; i < this.length; i += 1) {
        var index = Math.floor(Math.random() * (i + 1));    //  задаем переменную index из диапазона длинны массива
        var saved = this[index];                    //  сохраняем элемент массива под случайным индексом
        this[index] = this[i];                      //  присваиваем элементу текущее значение
        this[i] = saved;                            //  возвращаем элемент на место
    }
    return this;
});

Array.method("findAndReplace", function (find, replace) {    //  метод находит член массива со значением find, меняет его на replace
    var index = this.indexOf(find);
    if (index > -1) {
        this[index] = replace;
    }
});

Array.method("allMembers", function (value) {        //  метод опеределяет все члены массива на соответствие value. Если все равны - вернет true
    for (var i = 0; i < this.length; i += 1) {
        if (this[i] !== value) {
            return false;
        }
    }
    return true;
});

Element.method("addClass", function (className) {
    var classes = this.className.split(" ");        //  определяем переменную classes и присваиваем ей значения классов в виде массива (с помощью split)
    if (classes.indexOf(className) < 0) {           //  далее работаем с классами как с простым массивом (здесь проверяем на дубль)
        classes.push(className);                    //  добавляем имя класса в массив
        this.className = classes.join(" ").trim();  //  приводим готовый массив к строке и присваиваем его объекту в качестве className
    }                                               //  join - присоединение, trim - удаление лишних пробелов
    return this;
})

Element.method("removeClass", function (className) {    //  метод для удаления класса
    var classes = this.className.split(" ");
    var index = classes.indexOf(className);             //  создаем переменную для присваивания значения indexOf
    if (index >= 0) {                                   //  если такой индекс есть
        classes.splice(index, 1);                       //  splice удаляет элемент массива по значению его индекса (второй аргумент 1 - это количество удаляемых элементов)
        this.className = classes.join(" ").trim();
    }
})

var app = [];                   //  создаем переменную для хранения наших конструкторов

app.Sudoku = function (area) {  //  создаем класс Sudoku (игровое поле)
    var that = this;
    var table = document.createElement("table");    //  создаем таблицу (DOM)
    table.addClass("sudoku");
    var area = area || 3;                   //  определим значение area по-умолчанию
    var expo = area * area;                 //  если аргумент не указан, то по-умолчанию будет поле 9 на 9
    for (var i = 0; i < expo; i++) {        //  создаем таблицу через цикл
        var row = table.insertRow(-1);      //  insertRow добавляет строку в начало (-1)
        for (var j = 0; j < expo; j++) {    //  цикл для ячеек
            var cell = row.insertCell(-1);
            cell.innerHTML = i + ';' + j;   //  заполним ячейку для наглядности
            switch (i % area) {               //  % - остаток от деления (целое число)
                case 0:
                    cell.addClass("top");       //  класс для четной ячейки
                    break;
                case area - 1:
                    cell.addClass("bottom");    //  класс для нечетной ячейки
                    break;
            }
            switch (j % area) {
                case 0:
                    cell.addClass("left");      //  класс для четной ячейки
                    break;
                case area - 1:
                    cell.addClass("right");     //  класс для нечетной ячейки
                    break;
            }
        }
    }
    that.table = table;                     //  переменную table делаем видной из внешнего контекста
    that.expo = expo;
}
app.Sudoku.prototype = {                    //  определяем прототип для класса Sudoku
    fill: function (values) {               //  заполняем таблицу двухмерным массивом
        var that = this;
        that.values = values;                   //  передаем в качестве аргумента массив значений
        for (var i = 0; i < that.expo; i++) {   //  создаем цикл заполнения
            var row = that.table.rows[i];       //  DOM объекты строки
            for (var j = 0; j < that.expo; j++) {
                var cell = that.table.rows[i].cells[j];
                cell.innerHTML = values[i][j];
            }
        }
    },
    hide: function (count) {                     //  в качестве аргумента - количество скрываемых клеток
        var that = this;
        for (var i = 0; i < count; i += 1) {     //  применяем цикл, равный этому количеству
            var proccessing = true;              //  задаем переменную, для обработки случайного дубля
            while (proccessing) {                //  избегаем повторений полей, чтобы скрыть нужное количество
                var rowNumber = util.randomInteger(0, that.expo - 1);            //  случайный номер строки
                var colNumber = util.randomInteger(0, that.expo - 1);            //  случайный номер колонки
                if (!that.table.rows[rowNumber].cells[colNumber].hided) {        //  если поле уже скрыто, выбираем новое значение
                    that.table.rows[rowNumber].cells[colNumber].hided = true;    //  если ячейка не скрыта, задаем ячейке переменную hided, равную true
                    that.table.rows[rowNumber].cells[colNumber].innerHTML = "";  //  вычищаем ей внутренний html
                    var editCell = document.createElement("input");              //  добавляем в нее input для ввода в него цифры
                    that.table.rows[rowNumber].cells[colNumber].appendChild(editCell);  //  присваиваем введенный элемент ячейке
                    that.table.rows[rowNumber].cells[colNumber].editCell = editCell;    //  присваиваем значению параметра editCell ссылку на DOM-элемент
                    editCell.addEventListener("change", function () {        //  добавляем событие на изменение значения поля
                        that.check();                                        //  метод проверки, описан ниже
                    });
                    proccessing = false;
                }
            }
        }
        that.check();   //  выполняем проверку уже совпавших рядов. В идеале, таких быть не должно
    },
    check: function () {
        var that = this;
        that.unmark();                              //  метод снимает классы с отмеченных ячеек
        var rows = [], columns = [], areas = [];    //  создаем и заполняем проверенные массивы. По ним отслеживаем, чтобы значения не повторялись
        for (var i = 0; i < that.expo; i += 1) {
            rows.push([].fillIncr(that.expo, 1));
            columns.push([].fillIncr(that.expo, 1));
            areas.push([].fillIncr(that.expo, 1));
        }
        Array.prototype.forEach.call(that.table.rows, function (row, i) {    //  проверяем значения
            Array.prototype.forEach.call(row.cells, function (cell, j) {
                var value = that.getValue(cell);
                rows[i].findAndReplace(value, 0);       //  в проверочных массивах заменяем существующие в игровом поле значения на нули
                columns[j].findAndReplace(value, 0);
                areas[that.getArea(i, j)].findAndReplace(value, 0);
            });
        });
        var correct = {rows: 0, columns: 0, areas: 0};  //  проверяем правильность заполнения, создаем счетчик для проверки
        for (var i = 0; i < that.expo; i += 1) {
            if (rows[i].allMembers(0)) {                //  если все цифры в группе уникальны, помечаем группу, увеличиваем счетчик
                that.markRow(i);                        //  метод маркировки markRow
                correct.rows += 1;
            }
            if (columns[i].allMembers(0)) {
                that.markColumn(i);                     //  метод маркировки markColumn
                correct.columns += 1;
            }
            if (areas[i].allMembers(0)) {
                that.markArea(i);                       //  метод маркировки markArea
                correct.areas += 1;
            }
        }
        if (correct.rows === that.expo &&               //  если все группы отмечены как правильные, игра заканчивается (win)
            correct.columns === that.expo &&
            correct.areas === that.expo) {
            if (typeof (that.win) === "function") {      //  функция win определяем на любом этапе (позднее), не обязательно проверяем ее существование и тип
                that.win();
            }
        }
    },
    markCell: function (cell, state) {   //  отмечает ячейку cell классом, либо снимает класс, в зависимости от state
        if (state) {
            cell.addClass("marked");
        } else {
            cell.removeClass("marked");
        }
    },
    getValue: function (cell) {          //  возвращает значение ячейки, для поля, либо простой ячейки
        if (cell.editCell) {
            return parseInt(cell.editCell.value, 10);
        } else {
            return parseInt(cell.innerHTML, 10);
        }
    },
    markRow: function (number) {         //  отмечает строку целиком
        var that = this;
        Array.prototype.forEach.call(that.table.rows[number].cells, function (cell) {
            that.markCell(cell, true);
        });
    },
    markColumn: function (number) {      //  отмечает колонку целиком
        var that = this;
        Array.prototype.forEach.call(that.table.rows, function (row) {
            that.markCell(row.cells[number], true);
        });
    },
    markArea: function (number) {        //  отмечает область целиком
        var that = this;
        var area = Math.sqrt(that.expo);
        var startRow = parseInt(number / area, 10) * area;
        var startColumn = (number % area) * area;
        for (var i = 0; i < area; i += 1) {
            for (var j = 0; j < area; j++) {
                that.markCell(that.table.rows[i + startRow].cells[j + startColumn], true);
            }
        }
    },
    unmark: function () {                //  снимает отметки со всего игрового поля
        var that = this;
        Array.prototype.forEach.call(that.table.rows, function (row, i) {
            Array.prototype.forEach.call(row.cells, function (cell, j) {
                that.markCell(cell, false);
            });
        });
    },
    getArea: function (row, column) {    // возвращает номер области по номеру строки и столбца
        var that = this;
        var area = Math.sqrt(that.expo);
        return parseInt(row / area) * area + parseInt(column / area);
    },
}
app.Generator = function (area) {           //  отдельный класс, отвечающий за генерацию значений
    var that = this;
    var area = area || 3;                   //  указываем базовое значение
    var expo = area * area;                 //  указываем размерность (по-умолчанию равна 9)
    var base = [].fillIncr(expo, 1);        //  начальное значение 1
    var rows = [];
    for (var i = 0; i < expo; i++) {        //  создаем цикл заполнения
        var row = [];
        var start = (i % area) * area + parseInt(i / area, 10);       //  start - это смещение базового массива относительно строки
        for (var j = 0; j < expo; j++) {
            row.push(base.slice(start, expo).concat(base)[j]);  //  добавляем в массив row
        }
        rows.push(row);
    }
    that.rows = rows;               //  делаем переменные доступными
    that.expo = expo;
    that.area = area;
}
app.Generator.prototype = {         //  создаем прототип генератора
    invertVertical: function () {   //  делаем вертикальную инверсию
        var that = this;
        that.rows.reverse();        //  обращаемся к массиву rows и меняем его порядок на обратный
        return this;
    },
    invertHorizontal: function () { //  делаем горизонтальную инверсию
        var that = this;
        for (var i = 0; i < that.expo; i += 1) { //  проходим по каждому значению строки
            that.rows[i].reverse();           //  и инвертируем ее значение
        }
        return that;
    },
    getPositions: function () {       //  возвращает два случайных числа из диапазона длинны области
        var source = [].fillIncr(this.area);    //  создаем массив и обращаемся к fillIncr, заполняющей массив базовыми значениями
        var positions = {                       //  функция возвращает объект с двумя параметрами
            startPos: source.popRandom(),       //  source - это массив с методом popRandom
            destPos: source.popRandom()
        }
        return positions;
    },
    swapRows: function (count) {    //  перемешаем строки count количество раз
        var that = this;            //  задаем контекстную переменную
        for (var i = 0; i < count; i += 1) {                          //  цикл с количеством перемешиваний
            var area = util.randomInteger(0, that.area - 1);          //  переменная со случайным диапазоном размера игровой сетки
            var values = that.getPositions();                         //  переменная с результатом getPositions
            var sourcePosition = area * that.area + values.startPos;
            var destPosition = area * that.area + values.destPos;
            var row = that.rows.splice(sourcePosition, 1)[0];
            that.rows.splice(destPosition, 0, row);
        }
        return that;
    },
    swapColumns: function (count) {    //  перемешаем колонки count количество раз
        var that = this;
        for (var i = 0; i < count; i += 1) {
            var area = util.randomInteger(0, that.area - 1);
            var values = that.getPositions();
            var sourcePosition = area * that.area + values.startPos;
            var destPosition = area * that.area + values.destPos;
            for (var j = 0; j < that.expo; j += 1) {
                var cell = that.rows[j].splice(sourcePosition, 1)[0];
                that.rows[j].splice(destPosition, 0, cell);
            }
        }
        return that;
    },
    swapRowsRange: function (count) {           //  перемешать горизонтальные области
        var that = this;
        for (var i = 0; i < count; i++) {
            var values = that.getPositions();   //  два случайных числа, соответствующих диапазону доступных значений
            var rows = that.rows.splice(values.startPos * that.area, that.area);  //  формируем переменную из вырезанных из массива элементов
            var args = [values.destPos * that.area, 0].concat(rows);  //  переменная получает значение массива
            that.rows.splice.apply(that.rows, args);                  //  вставляем новые элементы в массив взамен вырезанных
            //  для метода splice для вставки требуются отдельные аргументы, если количество аргументов неизвестно, можно
            //  воспользоваться методом apply
            //  --that.values.splyce(destPosition*that.area, 0, row[0], row[1], row[2]);
        }
        return that;
    },
    swapColumnsRange: function (count) {   //  перемешать вертикальные области
        var that = this;
        for (var i = 0; i < count; i += 1) {
            var values = that.getPositions();
            for (var j = 0; j < that.expo; j += 1) {
                var cells = that.rows[j].splice(values.startPos * that.area, that.area);
                var args = [values.destPos * that.area, 0].concat(cells);
                //  доработать
                that.rows[j].splice.apply(that.rows[j], args);
            }
        }
        return that;
    },
    shakeAll: function () {                      //  метод замены всех цифр в таблице значений
        var that = this;
        var shaked = [].fillIncr(that.expo, 1); //  переменная-массив, заполненный значениями по возрастающей от 1 до 9
        shaked.shuffle();                       //  смешивание массива случайным образом
        for (var i = 0; i < that.expo; i += 1) {
            for (var j = 0; j < that.expo; j += 1) {
                that.rows[i][j] = shaked[that.rows[i][j] - 1];
            }
        }
        return that;
    }
}
app.Timer = function () {    //  создаем конструктор для тип Timer, который будет отвечать за учет времени и очков
    var that = this;
    var content = document.createElement("div").addClass("timer");
    var display = document.createElement("div").addClass("display");
    content.appendChild(display);
    that.now = 0;
    //При использовании функции setInterval следует помнить, что она возвращает лишь
    //индификатор таймера. Если мы удалим или перезапишем переменную that.timer
    //(или др.), сам таймер будет продолжать работать. Если нужно остановить таймер,
    //необходимо воспользоваться функцией clearInteval(индификатор)
    //либо clearTimout(ид) для функции setTimer(). Время задается в мс.
    that.timer = setInterval(function () {
        that.now += 1;
        that.refresh();
    }, 1000);
    that.content = content;
    that.display = display;
    that.refresh();
}
app.Timer.prototype = {
    refresh: function () {   //  метод для обнавления состояния времени
        var that = this;
        that.display.innerHTML = "Прошло времени: " + that.now + " сек."
    },
    getScore: function () {  //  метод для определения количества очков. Формула взята из примера.
        return parseInt(Math.pow(app.parameters.hided * app.parameters.area, 2) * 1000 / this.now, 10);
    },
    stop: function () {
        clearInterval(this.timer);
    }
}
app.parameters = {
    area: 5,        //размер области
    shuffle: 15,    //количество перемешиваний
    hided: 150       //количество скрытых ячеек
}

var tbl = new app.Sudoku(app.parameters.area);                      //  делаем вызов укземпляра Sudoku, конструктор которого формирует поле
document.body.querySelector("#playGround").appendChild(tbl.table);  //  через appendChild размещаем результат в body
var generator = new app.Generator(app.parameters.area);             //  создаем экземпляр генератора
generator.swapColumnsRange(app.parameters)                          //  применяем пять методов перемешивания
    .swapRowsRange(app.parameters.shuffle)
    .swapColumns(app.parameters.shuffle)
    .swapRows(app.parameters.shuffle)
    .shakeAll();
util.randomInteger(0, 1) ? generator.invertHorizontal() : 0; //  обращаемся к объекту util и вызываем метод randomInteger от 0 до 1
util.randomInteger(0, 1) ? generator.invertVertical() : 0;   //  и по результату инвертируем

tbl.fill(generator.rows);
tbl.hide(app.parameters.hided);
var timer = new app.Timer();
document.body.querySelector("#playGround").appendChild(timer.content);
tbl.win = function () {      //  событие при выйгрыше
    alert("Поздравляем! Вы победили со счетом " + timer.getScore());
    timer.stop();
}