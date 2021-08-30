import React from "react";
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import url from "../../assets/images/1.png";
import {BASE_URL} from '../../utils/constants';
import { reqDeleteAvatar } from "../../api";
import {BASE_SRC} from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {
    constructor(props){
        super(props);
        const {avatar,nickname}=props;
        this.nickname=nickname;
        this.state={
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [
              {
                uid: '-1',
                name: 'avatar.png',
                status: 'done',
                url:avatar?BASE_SRC+avatar:url
              }
            ]
        };
    }
  
    handleCancel = () => this.setState({ previewVisible: false });
  
    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
  
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };
  

    //获取图片名称
    getImg=()=>{
        const {fileList}=this.state;
        return fileList.length>0?fileList[0].name:''
    }

    //上传/删除图片
    handleChange =async ({file,fileList})=>{
        //上传图片
        if(file.status==='done'){
            const {status,data}=file.response;
            if(status===0){
                // const {name,url}=data;
                //更新fileList的最后一个元素（当前图片信息）
                file=fileList[fileList.length-1];
                file.name=data;
                message.success('上传成功');
            }else{
                message.error('上传失败');
            }
        }else if(file.status==='removed'){//删除图片
            const res=await reqDeleteAvatar(this.nickname);
            if(res.status===0){
               message.success('删除成功');
            }else{
              message.error('删除失败');
            }
        }

        //在上传/删除操作之后更新状态
        this.setState({fileList});
    }
  
    render() {
      const { previewVisible, previewImage, fileList, previewTitle } = this.state;
      const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );
      return (
        <>
          <Upload
            action={BASE_URL+"/user/upload"}
            listType="picture-card"
            accept='/image/*'
            data={{nickname:this.nickname}}
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </>
      );
    }
  }

  export default PicturesWall;
  