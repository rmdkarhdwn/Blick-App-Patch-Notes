<script lang="ts">
	// 부모(+page.svelte)와 주고받는 값/핸들러 타입
	type Props = {
		title: string;
		summary: string;
		boardLabel?: string;
		errorMessage: string;
		onClose: () => void;
		onSubmit: (event: SubmitEvent) => void;
	};

	// 입력 필드는 부모 상태와 동기화되도록 $bindable 사용
	let {
		title = $bindable(''),
		summary = $bindable(''),
		boardLabel = '패치노트',
		errorMessage,
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
				요약
				<input bind:value={summary} placeholder="짧은 설명을 입력하세요" />
			</label>

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
