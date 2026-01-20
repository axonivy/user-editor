import { Editor, type UserEditorProps } from './editor/Editor';

function App(props: UserEditorProps) {
  return <Editor {...props} />;
}

export default App;
