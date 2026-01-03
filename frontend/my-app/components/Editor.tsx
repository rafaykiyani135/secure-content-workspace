'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="bg-white dark:bg-slate-800">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        className="h-64 mb-12"
      />
    </div>
  );
}
