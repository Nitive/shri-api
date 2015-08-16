/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name :'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'},
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }

        callback(null, result);
    }, Math.round(Math.random() * 1000));
}

/**
 * Ваши изменения ниже
 */

/**
 * Описать:
 *   - общий request для всех callbacks
 *   - глобальные переменные i, l, K, j
 */

/**
 * @param {Object} obj
 * @return {Number} количество ключей у объекта
 */
var countKeys = function(obj) {
    var count = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) count++;
    }
    return count;
}


var App = function() {
    this.requests = ['/countries', '/cities', '/populations'];
    this.requestsCount = this.requests.length;
    this.responses = {};
}

/**
 * Ищет все города с названием place возвращает массив этих городов
 *
 * @param {String} place название города
 * @return {Array} массив найденых городов
 *
 * Возращает массив объектов следующего формата:
 *   {
 *     type: 'city'
 *     name: Название города (совпадает с place)
 *     count: количество населения в городе
 *   }
 */

App.prototype.getCitiesPopulation = function(place) {
    var result = [];
    this.responses['/populations'].forEach(function(city){
        if (place.toLowerCase() === city.name.toLowerCase()) {
            result.push({
                type: 'city',
                name: city.name,
                count: city.count
            })
        }
    });
    return result;
}

/**
 * Ищет все города страны place и суммирует население
 *
 * @param {String} place название города
 * @return {Array} массив найденых городов
 *
 * Возращает массив объектов следующего формата:
 *   {
 *     type: 'country'
 *     name: Название страны (совпадает с place)
 *     count: суммарное население в стране
 *   }
 */

App.prototype.getCountryPopulation = function(place) {
    var cities = [],
        populations = this.responses['/populations'],
        result = {
            type: 'country',
            name: place,
            count: 0
        };

    var cities = this.responses['/cities'].filter(function(e) {
        return e.country.toLowerCase() === place.toLowerCase();
    });
    for (var i = populations.length - 1; i >= 0; i--) {
        for (var j = cities.length - 1; j >= 0; j--) {
            if (cities[j].name === populations[i].name)
                result.count += populations[i].count;
        }
    }

    if (result.count) return result;
}

/**
 * Ищет города и страну с названием place
 * Считает сумарное население каждого города и страны
 * Подразумевается, что могут быть два города с одним названием, страна и
 * город с одним название, но не могут быть две страны с одинаковым названием
 *
 * @param {String} place название страны или города
 * @return {Array} массив мест с подсчитаным населением
 */
App.prototype.getCityOrCountryPopulation = function(place) {

    var results = this.getCitiesPopulation(place);
    var country = this.getCountryPopulation(place);
    if (country)
        results.push(country);

    return results;
}

/**
 * Выводит данные о населении на экран
 * Если данных нет, выводит ошибку

 * @param {Array} data пустой массив или
 * массив данных в формате:
 * [{
 *   type: 'city' or 'country'
 *   name: название города или страны
 *   count: количество населения
 * }, ...]
*/

App.prototype.displayResponse = function(data) {
    if (data.length === 0)
        alert('Нет города или страны с таким названием');

    data.forEach(function(place) {
        if (place.type === 'city')
            alert('Population in ' + place.name + ' city is ' + place.count);
        else if (place.type === 'country')
            alert('Population in ' + place.name + ' country is ' + place.count);
    });

    this.askAgain();
}

App.prototype.askAgain = function() {
    if (confirm('Узнать суммарное население другого места?'))
        this.askUser();
}

/**
 * Ничего не далает, если данные еще не пришли
 * Запрашивает у пользователя название страны или города,
 * если все запросы уже выполнены
 */

App.prototype.askUser = function() {
    if (countKeys(this.responses) !== this.requests.length)
        return

    var cities = []
    var countries = []
    this.responses['/cities'].forEach(function(e){
        cities.push(e.name);
        countries.push(e.country);
    });
    var place = window.prompt('Введите название города или страны.\nГорода: ' +
        cities.join(', ') + '\nСтраны: ' + countries.join(', '));

    this.displayResponse(this.getCityOrCountryPopulation(place));
}

App.prototype.addData = function(request, result) {
    this.responses[request] = result;
}

/**
 * Отправляет запросы на адреса из this.requests
 * Добавляет полученные данные в this.responses
 * Вызывает this.askUser() (выполнется только когда получены все данные)
*/

App.prototype.getData = function() {
    var self = this;
    this.requests.forEach(function(request){
        var callback = function (error, result) {
            if (error) throw(error);
            self.addData(request, result);
            self.askUser();
        }
        getData(request, callback);
    });
}


var app = new App();
app.getData();
