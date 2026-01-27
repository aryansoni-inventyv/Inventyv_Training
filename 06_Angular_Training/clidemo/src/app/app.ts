import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


interface ITerminalCommand {
  command: string;
  aliases?: string[];
  response: string;
  success: boolean;
  explanation: string;
}

interface ICommandOutput {
  input: string;
  responseLines: string[];   // rendered line by line
  success: boolean;
  explanation: string;
  timestamp: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [CommonModule , FormsModule],
})
export class App {
  input = '';
  history: ICommandOutput[] = [];

  constructor(private cdr: ChangeDetectorRef) {}


  @ViewChild('terminal') terminalRef!: ElementRef;
  @ViewChild('commandInput') inputRef!: ElementRef;

  commands: ITerminalCommand[] = [

  // ===== CREATE PROJECT =====
  {
    command: 'ng new demo-app',
    aliases: ['ng n demo-app'],
    response: `CREATE demo-app/
,CREATE demo-app/angular.json
,CREATE demo-app/package.json
,✔ Packages installed successfully.`,
    success: true,
    explanation: 'Creates a new Angular workspace and initial application.'
  },

  {
    command: 'ng generate demo-app --routing --styles=scss',
    aliases: [
      'ng g demo-app --routing --styles=scss',
      'ng generate demo-app -r --styles=scss',
      'ng g demo-app -r --styles=scss'
    ],
    response: `CREATE src/app/app-routing.module.ts
,CREATE src/app/app.component.scss
,✔ Project configured with routing and SCSS.`,
    success: true,
    explanation: 'Creates an Angular app with routing enabled and SCSS styling.'
  },

  // ===== SERVE =====
  {
    command: 'ng serve',
    aliases: ['ng s'],
    response: `✔ Compiled successfully.
,✔ Angular Live Development Server is listening on localhost:4200`,
    success: true,
    explanation: 'Builds and serves the application, watching for file changes.'
  },

  {
    command: 'ng serve --open',
    aliases: ['ng s -o'],
    response: `✔ Compiled successfully.
,✔ Opening browser at http://localhost:4200`,
    success: true,
    explanation: 'Serves the app and automatically opens it in the browser.'
  },

  // ===== BUILD =====
  {
    command: 'ng build',
    aliases: ['ng b'],
    response: `✔ Browser application bundle generation complete.
,✔ Assets copied.
,✔ Index.html generated.`,
    success: true,
    explanation: 'Builds the Angular app into the dist/ directory.'
  },

  {
    command: 'ng build --prod',
    aliases: ['ng b --prod'],
    response: `✔ Production build complete.
,✔ Output optimized and minified.`,
    success: true,
    explanation: 'Creates an optimized production build.'
  },

  // ===== GENERATE COMPONENT =====
  {
    command: 'ng generate component header',
    aliases: ['ng g c header'],
    response: `CREATE src/app/header/header.component.ts
,CREATE src/app/header/header.component.html
,CREATE src/app/header/header.component.scss
,UPDATE src/app/app.module.ts`,
    success: true,
    explanation: 'Generates a new Angular component.'
  },

  {
    command: 'ng generate service auth',
    aliases: ['ng g s auth'],
    response: `CREATE src/app/auth.service.ts`,
    success: true,
    explanation: 'Generates a new Angular service.'
  },

  {
    command: 'ng generate module shared',
    aliases: ['ng g m shared'],
    response: `CREATE src/app/shared/shared.module.ts`,
    success: true,
    explanation: 'Generates a new Angular module.'
  },

  // ===== TEST =====
  {
    command: 'ng test',
    aliases: [],
    response: `✔ Karma server started
,✔ Executed 12 of 12 tests SUCCESS`,
    success: true,
    explanation: 'Runs unit tests using Karma.'
  },

  // ===== E2E =====
  {
    command: 'ng e2e',
    aliases: [],
    response: `✔ Protractor tests executed successfully`,
    success: true,
    explanation: 'Runs end-to-end tests.'
  },

  // ===== LINT =====
  {
    command: 'ng lint',
    aliases: [],
    response: `✔ All files pass linting.`,
    success: true,
    explanation: 'Runs linting tools on the project.'
  },

  // ===== VERSION =====
  {
    command: 'ng version',
    aliases: ['ng v'],
    response: `Angular CLI: 17.0.0
,Node: 18.18.0
,OS: Windows x64`,
    success: true,
    explanation: 'Displays Angular CLI version and environment details.'
  },

  // ===== HELP =====
  {
    command: 'ng help',
    aliases: [],
    response: `Available commands:
  ,serve | build | generate | test | lint | version`,
    success: true,
    explanation: 'Displays help information for Angular CLI.'
  },

  // ===== ADD =====
  {
    command: 'ng add @angular/material',
    aliases: [],
    response: `✔ Installing packages
,✔ Angular Material added successfully`,
    success: true,
    explanation: 'Adds Angular Material to the project.'
  },

  // ===== UPDATE =====
  {
    command: 'ng update',
    aliases: [],
    response: `✔ Repository is up to date.`,
    success: true,
    explanation: 'Updates Angular packages to the latest compatible versions.'
  }
];


  ngOnInit() {
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }


  findCommand(input: string): ITerminalCommand | null {
    const normalized = input.trim().replace(/\s+/g, ' ').toLowerCase();

    for (const cmd of this.commands) {
      if (normalized === cmd.command.toLowerCase()) return cmd;

      if (cmd.aliases) {
        for (const alias of cmd.aliases) {
          if (normalized === alias.toLowerCase()) return cmd;
        }
      }
    }
    return null;
  }

  focusInput() {
  this.inputRef.nativeElement.focus();
}


  executeCommand() {
    if (!this.input.trim()) return;

    const matched = this.findCommand(this.input);

    const output: ICommandOutput = {
      input: this.input,
      responseLines: [],
      success: matched ? matched.success : false,
      explanation: matched
        ? matched.explanation
        : 'Command not recognized',
      timestamp: new Date()
    };
    this.history.push(output);

    if (matched) {
      this.renderWithDelay(
        matched.response.split(','),
        output
      );
    } else {
      this.renderWithDelay(
        [`Command not recognized: ${this.input}`],
        output
      ); 
    }

    this.input = '';
    this.scrollToBottom();
  }


  renderWithDelay(lines: string[], output: ICommandOutput) {
  lines.forEach((line, index) => {
    setTimeout(() => {
      output.responseLines.push(line);
      this.cdr.detectChanges();   
      this.scrollToBottom();
    }, index * 700);
  });
}



  clearTerminal() {
    this.history = [];
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = this.terminalRef.nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }

}
