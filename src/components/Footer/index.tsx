import { ReadOutlined } from '@ant-design/icons';
import './index.less';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="container">
				<div className="footer-content">
					<div className="logo">
						<ReadOutlined style={{ fontSize: 24, color: '#eb2f96' }} />
						<span className="brand-name">BorrowEase</span>
					</div>
					<div className="copyright">
						© 2025 BorrowEase. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
