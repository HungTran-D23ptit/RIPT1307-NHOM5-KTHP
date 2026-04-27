import {
	fetchDeviceInfo,
	getDisabledBorrowDate,
	getDisabledReturnDate,
	submitBorrowRequest,
	validateBorrowRequest,
} from '@/models/User/ThietBi/borrowRequest';
import { BorrowRequestState } from '@/models/User/ThietBi/types';
import { Button, Card, Col, DatePicker, Input, InputNumber, Row } from 'antd';
import { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { API_URL } from '@/config/config';
import { getImageUrl } from '@/utils/utils';
import './BorrowRequest.less';

const BorrowRequest = () => {
	const { id } = useParams<{ id: string }>();
	const [state, setState] = useState<BorrowRequestState>({
		device: null,
		quantity: 1,
		borrowDate: null,
		returnDate: null,
		reason: '',
		loading: false,
	});

	useEffect(() => {
		fetchDeviceInfo(id, (device) => setState((prev) => ({ ...prev, device })));
	}, [id]);

	const handleSubmit = async () => {
		if (!validateBorrowRequest(state)) return;

		const formData = {
			quantity: state.quantity,
			borrow_date: state.borrowDate.toISOString(),
			return_date: state.returnDate.toISOString(),
			reason: state.reason,
		};

		await submitBorrowRequest(id, formData, (loading) => setState((prev) => ({ ...prev, loading })));
	};

	return (
		<div className='borrow-request-container'>
			<a onClick={() => history.goBack()} className='back-link'>
				{'<-- Quay lại'}
			</a>
			<Card className='borrow-request-card'>
				<h2 className='page-title'>
					Mượn <span className='device-name'>{state.device?.name}</span>
				</h2>
				<div className='page-subtitle'>Điền vào biểu mẫu bên dưới để yêu cầu thiết bị này.</div>
				<Row gutter={32}>
					<Col span={10}>
						<Card className='device-detail-card'>
							<img
								src={getImageUrl(state.device?.image_url) || 'https://via.placeholder.com/300x200?text=No+Image'}
								alt={state.device?.name}
							/>
							<div className='device-name-bold'>{state.device?.name}</div>
							<div className='device-type'>{state.device?.type}</div>
							<div className='device-quantity'>
								Có sẵn: <b>{state.device?.quantity}</b>
							</div>
						</Card>
					</Col>
					<Col span={14}>
						<Card className='form-card'>
							<div style={{ marginBottom: 12 }}>
								<label>Start Date</label>
								<DatePicker
									value={state.borrowDate}
									onChange={(date) => setState((prev) => ({ ...prev, borrowDate: date }))}
									format='DD/MM/YYYY'
									disabledDate={getDisabledBorrowDate}
								/>
							</div>
							<div style={{ marginBottom: 12 }}>
								<label>End Date</label>
								<DatePicker
									value={state.returnDate}
									onChange={(date) => setState((prev) => ({ ...prev, returnDate: date }))}
									format='DD/MM/YYYY'
									disabledDate={getDisabledReturnDate(state.borrowDate)}
								/>
							</div>
							<div style={{ marginBottom: 12 }}>
								<label>Số lượng</label>
								<InputNumber
									min={1}
									max={state.device?.quantity || 1}
									value={state.quantity}
									onChange={(value) => setState((prev) => ({ ...prev, quantity: value || 1 }))}
								/>
							</div>
							<div style={{ marginBottom: 12 }}>
								<label>Mục đích sử dụng</label>
								<Input.TextArea
									value={state.reason}
									onChange={(e) => setState((prev) => ({ ...prev, reason: e.target.value }))}
									rows={3}
									maxLength={255}
									placeholder='Nhập mục đích sử dụng'
								/>
							</div>
							<Row justify='end' className='form-actions'>
								<Col>
									<Button onClick={() => history.goBack()}>Cancel</Button>
								</Col>
								<Col>
									<Button type='primary' loading={state.loading} onClick={handleSubmit}>
										Gửi yêu cầu
									</Button>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default BorrowRequest;
