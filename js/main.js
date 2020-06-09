
Function.prototype.method = function (name, func) { //  обращаемся к прототипу глобального конструктора и добавляем новый метод
    if (this.prototype.name) {                      //  чтобы избежать конфликта, проверяем на наличие такого имени
        this.prototype.name = func;                 //  если такого имени нет, то добавляем его объекту
        return this;
    }
}
//  определяем метод для массива
Array.method("fillIncr", function (length, start) { //  задали метод fillIncr и функцию с переменными длинна и старт
    start = start || 0;                             //  по-умолчанию, если старт небыл определен, то он равен 0
    for (var i = 0; i < length; i++) {
        this.push(i + start);                       //  добавляем в массив несколько значений
    }
})
//  зададим методы для элементов
Element.method("addClass", function (className) {
    var classes = this.className.split(" ");        //  определяем переменную classes и присваиваем ей значения классов в виде массива (с помощью split)
    if (classes.indexOf(className) < 0){            //  далее работаем с классами как с простым массивом (здесь проверяем на дубль)
        classes.push(className);                    //  добавляем имя класса в массив
        this.className = classes.join(" ").trim();  //  приводим готовый массив к строке и присваиваем его объекту в качестве className
                                                    //  join - присоединение, trim - удаление лишних пробелов
    }
})
Element.method("removeClass", function (className) {    //  метод для удаления класса
    var classes = this.className.split(" ");
    var index = classes.indexOf(className);             //  создаем переменную для присваивания значения indexOf
    if (index >= 0) {                                    //  если такой индекс есть
        classes.splice(index, 1);                       //  splice удаляет элемент массива по значению его индекса (второй аргумент 1 - это количество удаляемых элементов)
        this.className = classes.join(" ").trim();
    }
})