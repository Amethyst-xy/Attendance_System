import React,{Component}from "react";
import {Form,Input,Select,InputNumber } from "antd";

const {Option}=Select;

class ModifyForm extends Component{
  UNSAFE_componentWillMount(){
    this.user=this.props.user||{};
  }

  UNSAFE_componentWillReceiveProps(nextProps,nextState){
    this.user=nextProps.user||{};
  }

  componentDidUpdate(){
    this.formRef.resetFields();
  }
  render(){
    const {username,nickname,grade,online,allTime,finishTime}=this.user;

    const layoutCol={
      labelCol:{span:4},
      wrapperCol:{span:18}
    }

    return (
      <Form
        ref={ref=>this.formRef=ref}
        initialValues={{
          newNickname:nickname,
          username,
          grade,
          online:online?'正在打卡':'未打卡',
          allTime,
          finishTime
        }}
      >
          <Form.Item
            label='姓名'
            name='newNickname'
            {...layoutCol}
            rules={[
              {required:true,message:'姓名不能为空'}
            ]}
          >
              <Input/>
          </Form.Item>
          <Form.Item
            label='用户名'
            name='username'
            {...layoutCol}
            rules={[
              {required:true,message:'用户名不能为空'}
            ]}
          >
              {/*<Input disabled={username==='admin'?true:false}/>*/}
              <Input disabled/>
          </Form.Item>
          <Form.Item 
            label='年级'
            name='grade'
            {...layoutCol}
          >
            <Select>
              <Option value={0}>大一</Option>
              <Option value={1}>大二</Option>
              <Option value={2}>其他年级</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label='状态'
            name='online'
            {...layoutCol}
          >
            <Select>
              <Option value='正在打卡'>正在打卡</Option>
              <Option value='未打卡'>未打卡</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='总时长(h)'
            name='allTime'
            {...layoutCol}
            rules={[
              {required:true,message:'必须输入'},
            ]}
          >
              <InputNumber min={0} style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item
            label='已完成(h)'
            name='finishTime'
            {...layoutCol}
            rules={[
              {required:true,message:'必须输入'},
            ]}
          >
              <InputNumber min={0} style={{width:"100%"}}/>
          </Form.Item>
      </Form>
    );
  }
}

export default ModifyForm;