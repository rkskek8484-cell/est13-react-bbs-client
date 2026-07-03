import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';

export default function Write({ isModifyMode, boardId }) {
  let navigate = useNavigate();
  const [content, setContent] = useState({
    name: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    if (isModifyMode && boardId) {
      //boardId로 서버에 글을 조회, 조회 결과로 content 업데이트
      axios
        .get(`http://localhost:3000/view?id=${boardId}`)
        .then((response) => {
          console.log(response.data);
          if (!response.data || response.data.length === 0) {
            setIsError(true);
            return;
          }

          const data = response.data[0];

          setContent({
            name: data.writer,
            title: data.title,
            content: data.content,
            date: data.date,
          });
        })
        .catch((error) => {
          console.error(error);
          setIsError(true);
        })
        .finally(() => {
          console.log('요청완료');
        });
    }
  }, []);

  const write = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3000/write', {
        name: e.target.name.value,
        title: e.target.title.value,
        content: e.target.content.value,
      })
      .then((response) => {
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  const update = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3000/update', {
        name: e.target.name.value,
        title: e.target.title.value,
        content: e.target.content.value,
      })
      .then((response) => {
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  return (
    <>
      <h2 className='mb-3'>{isModifyMode ? '글수정' : '글쓰기'}</h2>
      <Form onSubmit={isModifyMode ? update : write}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>글쓴이</Form.Label>
          <Form.Control type='text' name='name' defaultValue={content.name} placeholder='이름을 입력해주세요' />
        </Form.Group>
        <Form.Group className='mb-3' controlId='title'>
          <Form.Label>제목</Form.Label>
          <Form.Control type='text' name='title' defaultValue={content.title} placeholder='제목을 입력해주세요' />
        </Form.Group>
        <Form.Group className='mb-3' controlId='content'>
          <Form.Label>내용</Form.Label>
          <Form.Control as='textarea' name='content' defaultValue={content.content} rows={3} />
        </Form.Group>
        <div className='d-flex gap-1 justify-content-end'>
          <Button type='submit' variant='primary'>
            입력
          </Button>
          <Button variant='secondary'>취소</Button>
        </div>
      </Form>
    </>
  );
}
