import './index.less';

export default function LinkButton(props){
    return <button className='link_btn' {...props}>{props.children}</button>
}