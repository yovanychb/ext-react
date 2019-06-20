import React from 'react'
import 'froala-editor/js/froala_editor.pkgd.min.js'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'font-awesome/css/font-awesome.css'
import FroalaEditor from 'react-froala-wysiwyg'
import { Panel } from '@sencha/ext-modern'

const divStyle = {
    height: '100%',
    width: '100%',
    background: 'gray'
};

const config = {
    placeholderText: 'Froala as an ExtReact Component!'
}
  
export default class FroalaEditorExample {
    render (){
        return(
            <Panel title="ExtReact with Froala Editor" layout="fit">
                <div style={divStyle}>
                <FroalaEditor tag='textarea' config={config} />
                </div>
            </Panel>
        );
    }
}