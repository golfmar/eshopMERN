const fs = require("fs");
const path = require("path");
// Путь к компоненту
const jsxFilePath = process.argv[2];
// Проверка на то, что путь к компоненту передан
if (!jsxFilePath) {
  console.log("Пожалуйста, укажите путь к файлу JSX.");
  process.exit(1);
}
// Определяем путь для SCSS файла на основе имени JSX файла
const scssFilePath = `${path.dirname(jsxFilePath)}/${path.basename(jsxFilePath, ".jsx")}.scss`;

// Функция для извлечения всех классов из JSX
function extractClassesFromJSX(filePath) {
  const jsxContent = fs.readFileSync(filePath, "utf8");
  const classNameRegex = /className=["']([^"']+)["']/g;
  let match;
  const classes = new Set();
  while ((match = classNameRegex.exec(jsxContent)) !== null) {
    const classNames = match[1].split(" ");
    classNames.forEach((className) => {
      classes.add(className.trim());
    });
  }
  return Array.from(classes);
}

// Функция для поиска корневого класса в компоненте
function findRootClass(classes) {
  // Считаем, что корневым классом будет тот, который встречается первым и является основным
  // для компонента. Предположим, что он не имеет модификаторов в имени.
  return classes.find((className) => !className.includes("-"));
}

// Функция для генерации SCSS из извлеченных классов
function generateSCSS(classes, rootClass) {
  let scssContent = `@import "../../Scss/common/colors";\n\n`; // Добавляем импорт в начало
  // Генерируем SCSS для корневого класса
  if (rootClass) {
    scssContent += `.${rootClass} {\n`; // Добавляем точку перед классом, так как это SCSS
  }
  // Генерируем SCSS для вложенных классов
  classes.forEach((className) => {
    if (className.startsWith(rootClass)) {
      // Генерируем модификаторы с использованием &-suffix
      if (className !== rootClass) {
        const classSuffix = className.replace(rootClass, ""); // Убираем основной класс
        scssContent += `  &${classSuffix} {\n  }\n`; // Модификаторы в SCSS
      }
    } else {
      // Генерируем простые селекторы для классов, не относящихся к корневому элементу
      scssContent += `  .${className} {\n  }\n`; // Просто .className для дочерних классов
    }
  });
  if (rootClass) {
    scssContent += `}\n`; // Закрываем блок с корневым элементом
  }
  return scssContent;
}

// Функция для добавления импорта SCSS в JSX
function addImportToJSX() {
  const jsxContent = fs.readFileSync(jsxFilePath, "utf8");
  // Проверяем, не добавлен ли уже импорт SCSS
  const importRegex = /import\s+['"]\.\.\/[a-zA-Z0-9-_]+\.scss['"];/;
  if (!importRegex.test(jsxContent)) {
    // Если импорт отсутствует, добавляем его в начало JSX файла
    const updatedJSX =
      `import "./${path.basename(scssFilePath)}";\n` + jsxContent;
    fs.writeFileSync(jsxFilePath, updatedJSX, "utf8");
    console.log(`Импорт SCSS был успешно добавлен в компонент: ${jsxFilePath}`);
  }
}

// Основная функция для создания SCSS и добавления импорта в JSX
function createSCSSFile() {
  const jsxContent = fs.readFileSync(jsxFilePath, "utf8");
  const classes = extractClassesFromJSX(jsxFilePath); // Извлекаем классы из JSX
  // Находим корневой класс компонента
  const rootClass = findRootClass(classes);
  if (!rootClass) {
    console.log("Не удалось найти корневой класс в компоненте.");
    return;
  }
  // Генерируем SCSS
  const scssContent = generateSCSS(classes, rootClass);
  fs.writeFileSync(scssFilePath, scssContent, "utf8"); // Записываем SCSS файл
  console.log(`SCSS файл был успешно создан по пути: ${scssFilePath}`);
  // Добавляем импорт SCSS в JSX файл
  addImportToJSX();
}

createSCSSFile();
