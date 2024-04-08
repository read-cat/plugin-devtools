import { transpileModule, ScriptTarget } from 'typescript';
import ReadCat from '../components/monaco/snippet/read-cat';
import Cheerio from '../components/monaco/snippet/cheerio';
import Plugin from '../components/monaco/snippet/plugin';
import Store from '../components/monaco/snippet/store';
import Request from '../components/monaco/snippet/request';
import BookSource from '../components/monaco/snippet/booksource';
import Log from '../components/monaco/snippet/log';

export const useTypeScript = () => {

  
  const compile = (content: string) => {
    return new Promise<string>((reso, reje) => {
      try {
        const { outputText } = transpileModule(content, {
          compilerOptions: {
            lib: ['esnext', 'dom'],
            target: ScriptTarget.ESNext,
            removeComments: true,
            types: [
              ReadCat,
              Cheerio,
              Plugin,
              Store,
              Request,
              BookSource,
              Log
            ]
          }
        });
        return reso(outputText);
      } catch (e) {
        return reje(e);
      }
    });
  }

  return {
    compile
  }

}