shri-api
========

[Demo](http://nitive.github.io/shri-api)

Проблема была в том, что цикл for не создает локальную область видимости, поэтому все callbacks используют общий `request`, равный `/populations`
Чтобы исправить проблему, нужно или использовать `bind` на callback, либо использовать forEach вместо цикла for.
Также использовались глобальные переменные `i`, `l`, `K`, `j`, что могло привести к проблемам в будующем.
