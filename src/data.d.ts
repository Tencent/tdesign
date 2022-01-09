export interface Form {
  repo: string;
  title: string;
  type: string;
  versionRepository: string;
  versionVue: string;
  versionBrowser: string;
  versionSystem: string;
  versionNode: string;
  reproduce: string;
  steps: string;
  expected: string;
  actual: string;
  remarks: string;
  functionContent: string;
  functionalExpectations: string;
}

export interface FormData {
  form: Form;
  version: {
    repo: { label: string; value: string }[];
    vue: { label: string; value: string }[];
  };
}

export interface RepoItem {
  name: string;
  github: string;
  npm: string;
}

