import arg from 'arg';
import inquirer from 'inquirer';
import type { ListQuestionOptions } from 'inquirer';

type Template = 'javascript' | 'typescript';

interface IPromptOptions {
  install: boolean;
  template: Template;
  targetDir?: string;
}

interface IPromptAnwsers extends IPromptOptions {
  projectName: string;
}

export function parseArgToOptions(rawArgs: string[]) {
  const args = arg({
    '--install': Boolean,
    '--help': Boolean,
    '-i': '--install',
    '-h': '--help',
  }, {
    argv: rawArgs.slice(2),
  });

  return {
    install: args['--install'] || false,
    template: args._[0] as Template,
  };
}

export async function promptForOptions(options: IPromptOptions) {
  const {
    template,
    targetDir,
    install,
  } = options;

  const defaultTemplate: Template = 'javascript';

  const inquirerQuestionsList: ListQuestionOptions[] = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Please input your project name:'
    }
  ];

  if (!install) {
    inquirerQuestionsList.push({
      type: 'confirm',
      name: 'install',
      message: 'Install all dependencies?',
      default: false
    });
  }

  if (template) {
    inquirerQuestionsList.push({
      type: 'list',
      name: 'template',
      message: 'Plase choose your template (default: javascript).',
      default: defaultTemplate,
    });
  }

  const anwser = await inquirer.prompt<IPromptAnwsers>(inquirerQuestionsList);

  return {
    ...options,
    template: (template || anwser.template),
    install: (install || anwser.install),
    targetDir: targetDir || anwser.projectName,
  };
}

export async function cli(args: string[]) {
  let options = parseArgToOptions(args);
  options = await promptForOptions(options);
  console.log(options);
}