# Interview Prep Tracker — План реализации

## Стек
- React 18 + Vite
- Tailwind CSS v3
- lucide-react (иконки)
- localStorage (персистентность)

---

## Структура файлов

```
src/
├── index.css              # @tailwind directives + импорт Inter
├── main.jsx               # точка входа
├── App.jsx                # роутинг состояний: import-screen / tracker
├── hooks/
│   └── useLocalStorage.js # хук для чтения/записи localStorage
└── components/
    ├── ImportScreen.jsx   # экран импорта JSON (drag & drop + кнопка)
    ├── Header.jsx         # заголовок + кнопка "Сбросить"
    └── TopicCard.jsx      # карточка темы со списком вопросов
```

---

## Шаги реализации

### 1. Настройка окружения
- [x] Создать проект `npm create vite@latest` с шаблоном react
- [x] Установить tailwindcss, postcss, autoprefixer
- [x] Инициализировать `tailwind.config.js`
- [ ] Подключить шрифт Inter через Google Fonts в `index.html`
- [ ] Настроить `index.css` — только @tailwind директивы
- [ ] Установить `lucide-react`

### 2. Хук useLocalStorage
- [ ] `useLocalStorage(key, defaultValue)` — читает/пишет JSON в localStorage
- [ ] Возвращает `[value, setValue]` как useState

### 3. App.jsx — главный компонент
- [ ] Читает данные из localStorage через хук
- [ ] Если данных нет → рендерит `<ImportScreen />`
- [ ] Если данные есть → рендерит `<Header />` + список `<TopicCard />`
- [ ] Передаёт `onImport(data)` и `onReset()` как коллбэки

### 4. ImportScreen.jsx
- [ ] Кнопка "Импортировать JSON" по центру экрана
- [ ] `<input type="file" accept=".json">` скрытый, триггер по кнопке
- [ ] Чтение файла через `FileReader` → `JSON.parse`
- [ ] Валидация структуры: наличие поля `topics` как массив
- [ ] При ошибке — показать сообщение об ошибке
- [ ] При успехе — вызвать `onImport(data)` → данные уходят в App

### 5. Header.jsx
- [ ] Заголовок "Interview Prep Tracker"
- [ ] Счётчик: кол-во тем / кол-во вопросов (общее)
- [ ] Кнопка "Сбросить" → вызов `onReset()`

### 6. TopicCard.jsx
- [ ] Принимает `topic: { name, questions[] }`
- [ ] Заголовок темы с иконкой chevron (expand/collapse)
- [ ] Состояние `isOpen` локальное (useState), по умолчанию — открыто
- [ ] Список вопросов — простые строки, каждая на отдельной строке
- [ ] Плавная анимация раскрытия

---

## Визуальные константы (Apple-style)

| Токен           | Значение                              |
|-----------------|---------------------------------------|
| bg-page         | `#f5f5f7`                             |
| bg-card         | `#ffffff`                             |
| text-primary    | `#1d1d1f`                             |
| text-secondary  | `#6e6e73`                             |
| accent          | `#0071e3`                             |
| border          | `rgba(0,0,0,0.08)`                    |
| border-radius   | `16px`                                |
| shadow          | `0 2px 12px rgba(0,0,0,0.08)`         |
| font            | Inter (Google Fonts)                  |
| transition      | `200–300ms ease`                      |

---

## Порядок разработки

1. Настройка окружения (шрифт, css, зависимости)
2. `useLocalStorage` хук
3. `App.jsx` — скелет с переключением экранов
4. `ImportScreen.jsx` — парсинг JSON
5. `TopicCard.jsx` — карточка с collapse
6. `Header.jsx` — заголовок и счётчики
7. Финальная полировка стилей

---

## Формат JSON (ожидаемый на вход)

```json
{
  "topics": [
    {
      "name": "OOP",
      "questions": [
        "4 принципа: encapsulation, inheritance, polymorphism, abstraction",
        "Interface vs abstract class — когда что использовать"
      ]
    }
  ]
}
```
