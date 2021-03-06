# Брифинг для лохов

## Каналы
### 'new game' Создание игры
* Для клиента - read-only
* Добавляет объект игры в объект активных игр (index.js:16)
* Возвращаемое значение:
```
{
    "id": "game#<socket.id>",
    "message": "...",
    "status": 200 || 400
}
```

### 'join game' - добавление клиента в комнату игры
* Двусторонний канал
* Запрос с клиента:
```
socket.emit('join game', { id: `game#${socket.id}` })
```
* Возвращаемый ответ:
{
    "id": "game#<socket.id>",
    "message": "...",
    "status": 200 || 400
}
* Как результат - добавляет клиента в комнату game#<socket.id>

### 'list games' - список всех активных игр
* Двусторонний канал
* Запрос с клиента:
```
socket.emit('list games')
```
* Возвращаемый ответ:
[
    "game#<...>",
    "game#<...>",
    "game#<...>",
    ... ,
    "game#<...>",
]


## EventEmitter
* Есть глобальный EventEmitter (index.js:100,116), который пингует раз в секунду.
* При эмите события он вызывает метод .nextTick() всех текущих активных игр (index.js:105)

## Game
### Игре передается:
* серверный сокет (io) для броадкаста
* id игровой сессии, собраный по темплейту \`game#${socket.id}\` (index.js:23), 
