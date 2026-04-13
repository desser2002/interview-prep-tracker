function ruPlural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export const translations = {
  ru: {
    languageName: 'EN',
    switchTo: 'en',

    // Header
    export: 'Экспорт',
    topicsCount: (n) => `${n} ${ruPlural(n, 'тема', 'темы', 'тем')}`,
    questionsCount: (n) => `${n} ${ruPlural(n, 'вопрос', 'вопроса', 'вопросов')}`,

    // Import / file picker
    checklistImported: 'Чеклист импортирован',
    appSubtitle: 'Импортируйте список тем и начните подготовку',
    checklistName: 'Название чеклиста',
    namePlaceholder: 'Например: Java Backend',
    back: 'Назад',
    start: 'Начать',
    importJson: 'Импортировать JSON',
    dropRelease: 'Отпустите файл',
    dropInstruction: 'Перетащите JSON-файл',
    dropClickHint: 'или нажмите чтобы выбрать',
    errorInvalidFormat: 'Неверный формат: ожидается объект с полем "topics" (массив).',
    errorReadFailed: 'Не удалось прочитать файл. Убедитесь, что это валидный JSON.',
    expectedFormat: 'Ожидаемый формат',

    // Checklist sidebar
    myChecklists: 'Мои чеклисты',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    deleteTitle: 'Удалить',
    addChecklist: 'Добавить чеклист',
    exportAll: 'Экспортировать все',
    exportAllTitle: 'Экспортировать все чеклисты в один файл',
    cancel: 'Отмена',
    selectFile: 'Выбрать файл',
    add: 'Добавить',
    deleteConfirm: (name) => `Удалить чеклист "${name}"?`,
    topicWord: (n) => ruPlural(n, 'тема', 'темы', 'тем'),
    questionsWord: (n) => ruPlural(n, 'вопрос', 'вопроса', 'вопросов'),

    // Progress banner
    overallProgress: 'Общий прогресс',
    mastered: 'Усвоено',
    partial: 'Частично',
    failed: 'Провал',
    notStarted: 'Не начато',
    progressSummary: (done, total, topics) =>
      `${done} из ${total} вопросов усвоено · ${topics} ${ruPlural(topics, 'тема', 'темы', 'тем')}`,

    // Review panel
    reviewToday: 'Повторить сегодня',

    // Question row
    reviewLabel: (date) => `Повторить: ${date}`,
    months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],

    // Topic card
    questionCount: (n) => `${n} ${ruPlural(n, 'вопрос', 'вопроса', 'вопросов')}`,
    addTopicButton: 'Добавить тему',
    addTopicTitle: 'Добавить новую тему',
    topicNameField: 'Название темы',
    topicNamePlaceholder: 'Например: Базы данных',
    questionsInputField: 'Список вопросов',
    questionsInputPlaceholder: 'Вставьте JSON или список вопросов (по одному в строке)',
    addTopicNameRequired: 'Укажите название темы или передайте поле "name" в JSON.',
    addTopicQuestionsRequired: 'Добавьте хотя бы один вопрос.',
    addTopicInvalidJson: 'Невалидный JSON. Проверьте синтаксис.',
    addTopicInvalidStructure: 'Неверная JSON-структура: ожидается массив вопросов или объект с полем "questions".',
    addTopicFormatError: 'Неверный формат. Используйте JSON или список вопросов по строкам.',
    addTopicFormatHint:
      'Формат 1 (JSON): {"name":"OOP","questions":["Что такое полиморфизм?","SOLID принципы"]}\nФормат 2 (списком):\nЧто такое полиморфизм?\nSOLID принципы',

    // Status dots
    statusNone: 'Не отмечено',
    statusFail: 'Провал',
    statusPartial: 'Частично',
    statusDone: 'Усвоено',
  },

  en: {
    languageName: 'RU',
    switchTo: 'ru',

    // Header
    export: 'Export',
    topicsCount: (n) => `${n} topic${n === 1 ? '' : 's'}`,
    questionsCount: (n) => `${n} question${n === 1 ? '' : 's'}`,

    // Import / file picker
    checklistImported: 'Checklist Imported',
    appSubtitle: 'Import your topic list and start preparing',
    checklistName: 'Checklist Name',
    namePlaceholder: 'Example: Java Backend',
    back: 'Back',
    start: 'Start',
    importJson: 'Import JSON',
    dropRelease: 'Drop the file',
    dropInstruction: 'Drag a JSON file',
    dropClickHint: 'or click to select',
    errorInvalidFormat: 'Invalid format: expected an object with a "topics" field (array).',
    errorReadFailed: 'Could not read the file. Make sure it is valid JSON.',
    expectedFormat: 'Expected Format',

    // Checklist sidebar
    myChecklists: 'My Checklists',
    collapse: 'Collapse',
    expand: 'Expand',
    deleteTitle: 'Delete',
    addChecklist: 'Add Checklist',
    exportAll: 'Export All',
    exportAllTitle: 'Export all checklists to one file',
    cancel: 'Cancel',
    selectFile: 'Select File',
    add: 'Add',
    deleteConfirm: (name) => `Delete checklist "${name}"?`,
    topicWord: (n) => `topic${n === 1 ? '' : 's'}`,
    questionsWord: (n) => `question${n === 1 ? '' : 's'}`,

    // Progress banner
    overallProgress: 'Overall Progress',
    mastered: 'Mastered',
    partial: 'Partial',
    failed: 'Failed',
    notStarted: 'Not Started',
    progressSummary: (done, total, topics) =>
      `${done} of ${total} question${total === 1 ? '' : 's'} mastered · ${topics} topic${topics === 1 ? '' : 's'}`,

    // Review panel
    reviewToday: 'Review Today',

    // Question row
    reviewLabel: (date) => `Review: ${date}`,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    // Topic card
    questionCount: (n) => `${n} question${n === 1 ? '' : 's'}`,
    addTopicButton: 'Add Topic',
    addTopicTitle: 'Add New Topic',
    topicNameField: 'Topic Name',
    topicNamePlaceholder: 'Example: Databases',
    questionsInputField: 'Questions List',
    questionsInputPlaceholder: 'Paste JSON or one question per line',
    addTopicNameRequired: 'Provide a topic name or include the "name" field in JSON.',
    addTopicQuestionsRequired: 'Add at least one question.',
    addTopicInvalidJson: 'Invalid JSON. Please check syntax.',
    addTopicInvalidStructure: 'Invalid JSON structure: expected a questions array or an object with a "questions" field.',
    addTopicFormatError: 'Invalid format. Use JSON or one question per line.',
    addTopicFormatHint:
      'Format 1 (JSON): {"name":"OOP","questions":["What is polymorphism?","SOLID principles"]}\nFormat 2 (plain list):\nWhat is polymorphism?\nSOLID principles',

    // Status dots
    statusNone: 'Not marked',
    statusFail: 'Failed',
    statusPartial: 'Partial',
    statusDone: 'Mastered',
  },
};
