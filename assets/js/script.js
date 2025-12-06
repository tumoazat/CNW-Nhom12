/**
 * File JavaScript chính của ứng dụng
 */

// Tự động ẩn thông báo sau 5 giây
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });
});

// Xác nhận xóa
function xácNhậnXóa(thông_điệp) {
    return confirm(thông_điệp || 'Bạn có chắc chắn muốn xóa?');
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(function(input) {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Tìm kiếm khóa học
function tìmKiếmKhóaHọc() {
    const keyword = document.getElementById('search-keyword');
    if (keyword && keyword.value.trim()) {
        window.location.href = 'index.php?controller=course&action=search&keyword=' + encodeURIComponent(keyword.value.trim());
    }
}

// Lọc theo danh mục
function lọcTheoDanhMục(categoryId) {
    window.location.href = 'index.php?controller=course&action=index&category_id=' + categoryId;
}

// ============================================
// UPLOAD FILE FUNCTIONS
// ============================================

// Preview avatar trước khi upload
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Kiểm tra định dạng file
        if (!file.type.match('image.*')) {
            alert('Vui lòng chọn file ảnh!');
            input.value = '';
            return;
        }
        
        // Kiểm tra kích thước file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 2MB!');
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('avatar-preview');
            if (preview) {
                preview.innerHTML = '<img src="' + e.target.result + '" alt="Avatar Preview">';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Preview tài liệu trước khi upload
function previewMaterial(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Kiểm tra định dạng file (cho phép PDF, DOC, DOCX, PPT, PPTX)
        const allowedTypes = ['application/pdf', 'application/msword', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-powerpoint',
                            'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        
        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ chấp nhận file PDF, DOC, DOCX, PPT, PPTX!');
            input.value = '';
            return;
        }
        
        // Kiểm tra kích thước file (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Kích thước file không được vượt quá 10MB!');
            input.value = '';
            return;
        }
        
        // Hiển thị thông tin file
        const fileInfo = document.getElementById('file-info');
        if (fileInfo) {
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            fileInfo.innerHTML = `
                <strong>Tên file:</strong> ${file.name}<br>
                <strong>Kích thước:</strong> ${fileSize} MB<br>
                <strong>Loại:</strong> ${file.type}
            `;
            fileInfo.style.display = 'block';
        }
    }
}

// ============================================
// DRAG & DROP UPLOAD
// ============================================

function initDragAndDrop(uploadAreaId, fileInputId) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);
    
    if (!uploadArea || !fileInput) return;
    
    // Click để chọn file
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, function() {
            uploadArea.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, function() {
            uploadArea.classList.remove('dragover');
        }, false);
    });
    
    // Handle dropped files
    uploadArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            
            // Trigger preview based on input type
            if (fileInputId.includes('avatar')) {
                previewAvatar(fileInput);
            } else if (fileInputId.includes('material')) {
                previewMaterial(fileInput);
            }
        }
    }, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// ============================================
// UPLOAD WITH PROGRESS BAR
// ============================================

function uploadFileWithProgress(formId, progressBarId) {
    const form = document.getElementById(formId);
    const progressBar = document.getElementById(progressBarId);
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        
        // Hiển thị progress bar
        if (progressBar) {
            progressBar.style.display = 'block';
            const progressFill = progressBar.querySelector('.progress-fill');
            
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressFill.style.width = percentComplete + '%';
                    progressFill.textContent = Math.round(percentComplete) + '%';
                }
            });
        }
        
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        alert('Upload thành công!');
                        window.location.reload();
                    } else {
                        alert('Lỗi: ' + (response.message || 'Upload thất bại'));
                    }
                } catch (e) {
                    // Nếu không phải JSON, reload trang
                    window.location.reload();
                }
            } else {
                alert('Lỗi kết nối server!');
            }
            
            if (progressBar) {
                progressBar.style.display = 'none';
            }
        });
        
        xhr.addEventListener('error', function() {
            alert('Lỗi kết nối!');
            if (progressBar) {
                progressBar.style.display = 'none';
            }
        });
        
        xhr.open('POST', form.action);
        xhr.send(formData);
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Đóng modal khi click outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ============================================
// FORM VALIDATION ENHANCEMENTS
// ============================================

function validateUploadForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput && !fileInput.files.length) {
        alert('Vui lòng chọn file để upload!');
        return false;
    }
    
    const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            input.focus();
            return false;
        }
    }
    
    return true;
}

// ============================================
// TOOLTIP INITIALIZATION
// ============================================

function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(function(tooltip) {
        const text = tooltip.getAttribute('data-tooltip');
        if (text) {
            const tooltipText = document.createElement('span');
            tooltipText.className = 'tooltip-text';
            tooltipText.textContent = text;
            tooltip.appendChild(tooltipText);
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize drag and drop for avatar
    initDragAndDrop('avatar-upload-area', 'avatar-input');
    
    // Initialize drag and drop for materials
    initDragAndDrop('material-upload-area', 'material-input');
    
    // Setup upload with progress
    uploadFileWithProgress('avatar-upload-form', 'avatar-progress');
    uploadFileWithProgress('material-upload-form', 'material-progress');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'ppt': '📊',
        'pptx': '📊',
        'xls': '📊',
        'xlsx': '📊',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'zip': '📦',
        'rar': '📦'
    };
    return icons[ext] || '📎';
}
