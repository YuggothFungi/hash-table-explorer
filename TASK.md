# TASK.md

## 🛠 Основная функциональность

**Реализация ядра хеш-таблицы**
- [x] Создать базовый класс HashTable
- [x] Реализовать метод добавления элементов
- [x] Реализовать метод поиска элементов
- [x] Добавить обработку переполнения таблицы

**Алгоритмы хеширования**
- [x] Метод деления
  - [x] Реализовать calculateDivisionHash()
  - [x] Написать тесты для разных размеров таблиц
- [x] Метод умножения
  - [x] Создать функцию calculateMultiplicationHash()
  - [x] Реализовать выбор коэффициента умножения
- [x] Метод многочленов
  - [x] Написать функцию polynomialHash()
  - [x] Добавить валидацию входных данных

**Методы разрешения коллизий**
- [x] Внешние цепочки
  - [x] Реализовать цепочку через связный список
  - [x] Добавить визуализацию цепочек
- [x] Внутренние цепочки
  - [x] Реализовать цепочку через дополнительную строку в таблице, которая указывает индекс строки, в которую был записан ключ
- [x] Линейное опробование
  - [x] Реализовать алгоритм линейного поиска с шагом 1
  - [x] Обработать случай полного обхода таблицы
- [x] Квадратичное опробование
  - [x] Реализовать алгоритм квадратичного поиска
  - [x] Добавить ограничение на максимальное число проб

**Пользовательский интерфейс**
- [x] Панель управления параметрами хеш-таблицы
  - [x] Создать компонент выбора типа ключа
  - [x] Реализовать ввод размера таблицы (ограничение 5-20 строк)
  - [x] Реализовать выбор типа ключа (числовой 0 - 1023, строковый до 50 символов)
  - [x] Реализовать выбор метода хеширования
  - [x] Реализовать выбор метода разрешения коллизий
  - [x] Реализовать блокировку изменения параметров после создания таблицы
  - [x] Реализовать кнопку включения редактирования параметров
  - [x] Создать кнопку для рендеринга таблицы
- [x] Визуализация таблицы
  - [x] Создать компонент HashTableVisualizer, создающий таблицу на основании выбранных параметров
  - [x] Создать поле ввода ключа (с проверкой в зависимости от типа ключа) и кнопку добавить, которая вызывает алгоритм добавления ключа с разрешением коллизий с установленными параметрами хеш-таблицы
  - [x] Добавить кнопку поиска ключа, которая выполняет операцию поиска и подсвечивает найденный элемент
  - [x] Реализовать функцию поиска ключа, которая должна работать аналогично добавлению, (без собственно добавления)
  - [x] Реализовать отображение найденного ключа
  - [ ] Реализовать анимацию добавления элементов
- [ ] Пошаговое выполнение
  - [ ] Создать панель отображающую действия и вычисления на каждом этапе алгоритма
  - [ ] Создать систему подсветки текущего шага в таблице

## 🐛 Обработка ошибок
- [x] Реализовать отображение ошибки при переполнении
- [x] Добавить уведомление "Ключ не найден"
- [ ] Обработать некорректный ввод ключей

## 🔄 Реструктуризация проекта
- [x] Создать структуру директорий согласно PLANNING.md
  - [x] Создать директорию components/
  - [x] Создать директорию lib/
    - [x] Создать поддиректории hashing/ и collision/
  - [x] Создать директорию types/
  - [x] Создать директорию utils/
- [x] Переместить существующие файлы в соответствующие директории
- [x] Обновить импорты в файлах