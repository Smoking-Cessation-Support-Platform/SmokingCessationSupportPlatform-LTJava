import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KeHoach = () => {
    const navigate = useNavigate();

    // State to manage individual notes for each step
    const [notes, setNotes] = useState({
        step1: '',
        step2: '',
        step3: '',
        step4: '',
        step5: '',
        step6: '',
    });

    // Handle changes in the textarea
    const handleNoteChange = (stepKey, event) => {
        setNotes(prevNotes => ({
            ...prevNotes,
            [stepKey]: event.target.value,
        }));
    };

    // Handle back button
    const handleGoBack = () => {
        navigate(-1); // Navigates back one step in the browser history
    };

    return (
        <>
            <style>{`
                /* Your existing CSS */
                body {
                    font-family: 'Segoe UI', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f9;
                    color: #333;
                }

                .back-button {
                    position: fixed;
                    top: 15px;
                    right: 15px;
                    background-color: #f97316;
                    color: white;
                    padding: 8px 14px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    z-index: 999;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }

                .container {
                    max-width: 960px;
                    margin: auto;
                    background: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.05);
                }

                h2, h3 {
                    color: #d84315;
                }

                .section {
                    margin-bottom: 40px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }

                table, th, td {
                    border: 1px solid #ddd;
                }

                th, td {
                    padding: 8px;
                }

                th {
                    background-color: #fbe9e7;
                }

                textarea {
                    width: 100%;
                    min-height: 60px;
                    resize: vertical;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-family: 'Segoe UI', sans-serif;
                    font-size: 14px;
                }
            `}</style>

            {/* Back button */}
            <button className="back-button" onClick={handleGoBack}>← Quay lại</button>

            <div className="container">
                {/* Kế hoạch cai thuốc */}
                <div className="section" id="plan">
                    <h2>📝 Kế hoạch cai thuốc</h2>
                    <h3>6 bước cai thuốc </h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Bước</th>
                                <th>Mô tả</th>
                                <th>Ghi chú cá nhân</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>B1</td>
                                <td>Xác định lý do muốn cai thuốc</td>
                                <td>
                                    <textarea
                                        placeholder="Ghi lại lý do của bạn..."
                                        value={notes.step1}
                                        onChange={(e) => handleNoteChange('step1', e)}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>B2</td>
                                <td>Đặt ngày bắt đầu</td>
                                <td>
                                    <textarea
                                        placeholder="Chọn ngày phù hợp..."
                                        value={notes.step2}
                                        onChange={(e) => handleNoteChange('step2', e)}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>B3</td>
                                <td>Hiểu rõ cơn thèm thuốc</td>
                                <td>
                                    <textarea
                                        placeholder="Bạn thường thèm khi nào?..."
                                        value={notes.step3}
                                        onChange={(e) => handleNoteChange('step3', e)}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>B4</td>
                                <td>Chuẩn bị phương án thay thế</td>
                                <td>
                                    <textarea
                                        placeholder="Kẹo ngậm, tập thể dục..."
                                        value={notes.step4}
                                        onChange={(e) => handleNoteChange('step4', e)}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>B5</td>
                                <td>Chia sẻ với người thân</td>
                                <td>
                                    <textarea
                                        placeholder="Ai có thể hỗ trợ bạn?"
                                        value={notes.step5}
                                        onChange={(e) => handleNoteChange('step5', e)}
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>B6</td>
                                <td>Tự thưởng khi vượt qua cột mốc</td>
                                <td>
                                    <textarea
                                        placeholder="Phần thưởng nhỏ cho bản thân..."
                                        value={notes.step6}
                                        onChange={(e) => handleNoteChange('step6', e)}
                                    ></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default KeHoach;