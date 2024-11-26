'use client';

import { convertFromHTML, convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';


export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  id: string;
  name?: string;
  type?: string;
  rows?: number;
  className?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  suffix?: React.ReactNode;
  value?: string | null;
}

const RichTextField = ({ className, onChange, ...props }: TextFieldProps) => {
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  );

  useEffect(() => {
    if (props.value && !editorState) {
      const preparedDraft = prepareDraft(props.value);
      setEditorState(preparedDraft);
    }
  }, [props.value, editorState]);

  const prepareDraft = (value: string) => {
    const editorState = EditorState.createWithContent(convertFromHTML(value));
    return editorState;
  };

  const draft = props.value ? prepareDraft(props.value) : undefined;

  const handleEditorChange = (editorState: EditorState) => {
    const convertedContent = convertToHTML(editorState.getCurrentContent());
    convertedContent && onChange?.(convertedContent);
    setEditorState(editorState);
  };

  return (
    <div className={`flex flex-col last-of-type:mb-0 h-96 ` + className}>
      {props.label ? (
        <label
          htmlFor={props.id}
          className="text-sm font-medium mb-2 text-dark-500"
        >
          {props.label}
          {props.required ? '*' : ''}
        </label>
      ) : (
        <></>
      )}
      <Editor
        editorState={editorState ?? draft}
        spellCheck
        toolbarClassName="toolbarClassName"
        toolbarStyle={{ className: 'bg-red-500' }}
        wrapperClassName="flex-1 overflow-clip border  rounded-md bg-slate-50 text-sm focus:outline-none w-full text-slate-600 "
        editorClassName="!h-60 custom-scrollbar px-4"
        onEditorStateChange={(editorState) => {
          handleEditorChange(editorState);
        }}
      />
    </div>
  );
};

export default RichTextField;
