export interface TextProvider {
  convertTextToMp3(content: string, filename: string): Promise<string>;
}
