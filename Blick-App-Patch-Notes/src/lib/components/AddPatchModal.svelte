<script lang="ts">
	// 부모(+page.svelte)와 주고받는 값/핸들러 타입
	type Props = {
		title: string;
		content: string;
		imagePreviewUrl: string;
		boardLabel?: string;
		errorMessage: string;
		onImageFileChange: (event: Event) => void;
		onImagePaste: (event: ClipboardEvent) => void;
		onClearImage: () => void;
		onClose: () => void;
		onSubmit: (event: SubmitEvent) => void;
	};

	// 입력 필드는 부모 상태와 동기화되도록 $bindable 사용
	let {
		title = $bindable(''),
		content = $bindable(''),
		imagePreviewUrl,
		boardLabel = '패치노트',
		errorMessage,
		onImageFileChange,
		onImagePaste,
		onClearImage,
		onClose,
		onSubmit
	}: Props = $props();
</script>

<div class="modal-backdrop">
	<!-- 패치노트 추가 모달 -->
	<div class="add-modal" role="dialog" aria-modal="true" aria-labelledby="add-patch-title">
		<h3 id="add-patch-title">{boardLabel} 추가</h3>
		<!-- submit 시 부모에서 넘긴 onSubmit 실행 -->
		<form class="add-form" onsubmit={onSubmit}>
			<label>
				제목
				<input bind:value={title} placeholder={`예: ${boardLabel} 제목`} />
			</label>
			<label>
				내용
				<textarea bind:value={content} placeholder="게시물 내용을 입력하세요"></textarea>
			</label>
			<div class="image-editor" onpaste={onImagePaste}>
				<label class="file-picker">
					이미지 파일 선택
					<input type="file" accept="image/*" onchange={onImageFileChange} />
				</label>
				<p class="hint">또는 여기에 이미지 붙여넣기(Ctrl/Cmd + V)</p>

				{#if imagePreviewUrl}
					<div class="preview-wrap">
						<img src={imagePreviewUrl} alt="업로드 미리보기" />
						<button type="button" class="remove-image-btn" onclick={onClearImage}
							>이미지 제거</button
						>
					</div>
				{/if}
			</div>

			{#if errorMessage}
				<p class="form-error">{errorMessage}</p>
			{/if}

			<div class="modal-actions">
				<button type="button" class="ghost-btn" onclick={onClose}>취소</button>
				<button type="submit" class="submit-btn">추가하기</button>
			</div>
		</form>
	</div>
</div>

<style>
	/* Overlay: 추가 모달 배경 */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: #11182766;
		display: grid;
		place-items: center;
		padding: 20px;
		z-index: 20;
	}

	/* Dialog: 추가 폼 컨테이너 */
	.add-modal {
		width: min(520px, 100%);
		max-height: min(88vh, 920px);
		overflow-y: auto;
		background: #ffffff;
		border: 2px solid #16181d;
		border-radius: 14px;
		padding: 20px;
		box-shadow: 0 18px 34px #0000002e;
	}

	/* Title */
	h3 {
		margin: 0 0 14px;
		font-size: 22px;
	}

	/* Form Layout */
	.add-form {
		display: grid;
		gap: 12px;
	}

	label {
		display: grid;
		gap: 6px;
		font-size: 14px;
		font-weight: 600;
	}

	input {
		border: 1px solid #9ca3af;
		border-radius: 8px;
		padding: 10px 12px;
		font-size: 14px;
		font-family: inherit;
	}

	textarea {
		border: 1px solid #9ca3af;
		border-radius: 8px;
		padding: 10px 12px;
		font-size: 14px;
		font-family: inherit;
		min-height: 110px;
		resize: vertical;
	}

	.image-editor {
		border: 1px dashed #94a3b8;
		border-radius: 10px;
		padding: 10px;
		background: #f8fafc;
	}

	.file-picker {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		background: #fff;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	.file-picker input {
		display: none;
	}

	.hint {
		margin: 10px 0 0;
		font-size: 13px;
		color: #475569;
	}

	.preview-wrap {
		margin-top: 10px;
		display: grid;
		gap: 8px;
	}

	.preview-wrap img {
		width: min(100%, 420px);
		max-height: 260px;
		object-fit: contain;
		border-radius: 10px;
		border: 1px solid #d1d5db;
		background: #fff;
	}

	.remove-image-btn {
		width: fit-content;
		height: 32px;
		padding: 0 10px;
		border-radius: 8px;
		border: 1px solid #ef4444;
		background: #fff;
		color: #b91c1c;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
	}

	/* Error */
	.form-error {
		margin: 0;
		font-size: 13px;
		color: #dc2626;
	}

	/* Actions */
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 4px;
	}

	.ghost-btn,
	.submit-btn {
		height: 38px;
		padding: 0 12px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	.ghost-btn {
		border: 1px solid #9ca3af;
		background: #fff;
		color: #111827;
	}

	.submit-btn {
		border: 1px solid #5366fb;
		background: #5366fb;
		color: #fff;
	}
</style>
