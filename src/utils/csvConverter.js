export default function (csv) {
  const lines = csv.split('\r');
  const result = [];
  const headers = ['id', ...lines[0].split(';'), 'Duplicate with'];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(';');

    if (currentline[0] === '\n') {
      break;
    }
    obj[headers[0]] = i;
    for (let j = 0; j < currentline.length; j++) {
      if (currentline[j]) {
        obj[headers[j + 1]] = currentline[j].trim();
      }
    }
    obj[headers[headers.length - 1]] = null;
    result.push(obj);
  }

  return { headers, result };
}
