/**
 * Auto-generate documentation from the component's propTypes.
 * Adapted from Material-UI's PropTypeDescription component:
 *  https://github.com/callemall/material-ui/blob/82482758573dc714b210529dcf092dab904db0ba/docs/src/app/components/PropTypeDescription.js
 * (c) Call-Em-All
 */

const fs = require('fs');
const parse = require('react-docgen').parse;
const parseDoctrine = require('doctrine').parse;

function generatePropType(type) {
  switch (type.name) {
    case 'func':
      return 'function';
    case 'custom':
      return type.raw;
    case 'enum': {
      const values = type.value.map(v => v.value).join('<br>&nbsp;');
      return `enum:<br>&nbsp;${values}<br>`;
    }
    default:
      return type.name;
  }
}

function generateDescription(required, description, type) {
  const parsed = parseDoctrine(description);

  // two new lines result in a newline in the table. all other new lines
  // must be eliminated to prevent markdown mayhem.
  const jsDocText = parsed.description.replace(/\n\n/g, '<br>').replace(/\n/g, ' ');

  if (parsed.tags.some(tag => tag.title === 'ignore')) {
    return null;
  }
  let signature = '';

  if (type.name === 'func' && parsed.tags.length > 0) {
    // Remove new lines from tag descriptions to avoid markdown errors.
    parsed.tags.forEach((tag) => {
      if (tag.description) {
        tag.description = // eslint-disable-line no-param-reassign
          tag.description.replace(/\n/g, ' ');
      }
    });

    // Split up the parsed tags into 'arguments' and 'returns' parsed objects. If there's no
    // 'returns' parsed object (i.e., one with title being 'returns'), make one of type 'void'.
    const parsedLength = parsed.tags.length;
    let parsedArgs = [];
    let parsedReturns;

    if (parsed.tags[parsedLength - 1].title === 'returns') {
      parsedArgs = parsed.tags.slice(0, parsedLength - 1);
      parsedReturns = parsed.tags[parsedLength - 1];
    } else {
      parsedArgs = parsed.tags;
      parsedReturns = {
        type: { name: 'void' },
      };
    }

    signature += '<br><br>**Signature:**<br>`function(';
    signature += parsedArgs.map(tag => `${tag.name}: ${tag.type.name}`).join(', ');
    signature += `) => ${parsedReturns.type.name}\`<br>`;
    signature += parsedArgs.map(tag => `*${tag.name}:* ${tag.description}`).join('<br>');
    if (parsedReturns.description) {
      signature += `<br> *returns* (${parsedReturns.type.name}): ${parsedReturns.description}`;
    }
  }

  return `${jsDocText}${signature}`;
}

function render(code) {
  let text = '| Name | Type | Default | Description |\n' +
             '|:-----|:-----|:-----|:-----|\n';

  const componentInfo = parse(code);

  Object.keys(componentInfo.props).forEach((key) => {
    const prop = componentInfo.props[key];

    const description = generateDescription(prop.required, prop.description, prop.type);

    if (description === null) return;

    let defaultValue = '';

    if (prop.defaultValue) {
      defaultValue = prop.defaultValue.value.replace(/\n/g, '');
    }

    if (prop.required) {
      key = `<span style="color: #31a148">${key} *</span>`; // eslint-disable-line no-param-reassign
    }

    text += `| ${key} | ${generatePropType(prop.type)} | ${defaultValue} | ${description} |\n`;
  });

  return text;
}

const source = fs.readFileSync('src/index.js', 'utf8')
  // react-docgen doesn't pick up on "import * as React" for some reason, so
  // hack around that
  .replace('* as React', 'React');
const markdown = render(source);

console.log(markdown);
