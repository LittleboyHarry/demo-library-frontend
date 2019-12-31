import React, { useImperativeHandle, forwardRef } from 'react'
import { useAppContext } from '../hook'
import { Form, Input, Row, Col, Select } from 'antd'
const { Option } = Select;

function HalfFormItem({ label, children }) {
	return <Col
		xs={{
			span: 20,
			offset: 2
		}}
		sm={{
			span: 9,
			offset: 2
		}}>
		<Form.Item {...{ label, children }} />
	</Col>
}

function Gap({ height }) {
	return <div style={{ height }} />
}

const BookForm = Form.create({
	mapPropsToFields({ rawBookInfo }) {
		return rawBookInfo && {
			name: Form.createFormField({
				value: rawBookInfo.name,
			}),
			author: Form.createFormField({
				value: rawBookInfo.author,
			}),
			press: Form.createFormField({
				value: rawBookInfo.press,
			}),
			isbn: Form.createFormField({
				value: rawBookInfo.isbn,
			}),
			category: Form.createFormField({
				value: rawBookInfo.catgory,
			}),
		}
	}
})(forwardRef(({ form, submitButton, onSubmit }, ref) => {
	useImperativeHandle(ref, () => ({
		form,
	}));

	const { categories } = useAppContext()
	const { getFieldDecorator, validateFieldsAndScroll } = form

	return <Form
		style={{ maxWidth: 960 }}>
		<Gap height={32} />
		<Row>
			<HalfFormItem label="书名">
				{getFieldDecorator('name', {
					rules: [{ required: true, message: '请填写书名' }],
				})(<Input />)}
			</HalfFormItem>
			<HalfFormItem label="作者">
				{getFieldDecorator('author', {
					rules: [{ required: true, message: '请填作者' }],
				})(<Input />)}
			</HalfFormItem>
			<HalfFormItem label="出版社">
				{getFieldDecorator('press', {
					rules: [{ required: true, message: '请填出版社' }],
				})(<Input />)}
			</HalfFormItem>
			<HalfFormItem label="ISBN">
				{getFieldDecorator('isbn', {
					rules: [{ required: true, message: '请填 ISBN' }],
				})(<Input />)}
			</HalfFormItem>
			<HalfFormItem label="分类">
				{getFieldDecorator('catgory', {
					rules: [{ required: true, message: '请填分类' }],
				})(
					<Select showSearch>
						{
							categories && categories.map(({ name, index }) => <Option key={index} value={index}>{`${index} - ${name}`}</Option>)
						}
					</Select>)}
			</HalfFormItem>
		</Row>
		<Gap height={32} />
		<Row type="flex" justify="center">
			<div onClick={() => {
				validateFieldsAndScroll((err, values) => {
					if (!err) onSubmit(values)
				});
			}}>{submitButton}</div>
		</Row>
	</Form>
}))

export default BookForm