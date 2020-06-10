var util = {
    //функция генирирует целое случайное число из диапозона min max включительно
    randomInteger: function(min, max) {
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

Element.method("addClass", function (className) {
    var classes = this.className.split(" ");        //  определяем переменную classes и присваиваем ей значения классов в виде массива (с помощью split)
    if (classes.indexOf(className) < 0) {           //  далее работаем с классами как с простым массивом (здесь проверяем на дубль)
        classes.push(className);                    //  добавляем имя класса в массив
        this.className = classes.join(" ").trim();  //  приводим готовый массив к строке и присваиваем его объекту в качестве className
    }                                               //  join - присоединение, trim - удаление лишних пробелов
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
    }
}
//  отдельный класс, отвечающий за генерацию значений
app.Generator = function (area) {
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
    invertHorisontal: function () { //  делаем горизонтальную инверсию
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
    swapRowsRange: function (count) {   //  перемешать горизонтальные области
        var that = this;
        for (var i = 0; i < count; i++) {
            var values = that.getPositions();   //  два случайных числа, соответствующих диапазону доступных значений
            var rows = that.rows.splice(values.startPos * that.area, that.area);  //  формируем переменную из вырезанных из массива элементов
            var args = [values.destPos * that.area, 0].concat(rows);    //  переменная получает значение массива
            that.rows.splice.apply(that.values, args);                //  вставляем новые элементы в массив взамен вырезанных
            //  для метода splice для вставки требуются отдельные аргументы, если количество аргументов неизвестно, можно
            //  воспользоваться методом apply
            //  --that.values.splyce(destPosition*that.area, 0, row[0], row[1], row[2]);
        }
        return that;
    },
    swapColumnsRange: function (count) {   //  перемешать вертикальные области
        var that = this;
        for (var i = 0; i < count; i+=1) {
            var values = that.getPositions();
            for (var j = 0; j < that.expo; j+=1) {
                var cells = that.rows[j].splice(values.startPos * that.area, that.area);
                var args = [values.destPos * that.area, 0].concat(cells);
                //  доработать
                that.rows[j].splice.apply(that.values[j], args);
            }
        }
        return that;
    },
}

var tbl = new app.Sudoku();                 //  делаем вызов укземпляра Sudoku, конструктор которого формирует поле
document.body.appendChild(tbl.table);       //  через appendChild размещаем результат в body
var generator = new app.Generator;          //  создаем экземпляр генератора
generator.invertVertical().invertHorisontal().swapRows(15); //  делаем вертикальный и горизонтальный реверс значений поля
tbl.fill(generator.rows);