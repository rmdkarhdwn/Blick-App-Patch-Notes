<script lang="ts">
	type Props = {
		loginId: string;
		loginPassword: string;
		loginError: string;
		onClose: () => void;
		onSubmit: (event: SubmitEvent) => void;
	};

	let {
		loginId = $bindable(''),
		loginPassword = $bindable(''),
		loginError,
		onClose,
		onSubmit
	}: Props = $props();
</script>

<div class="modal-backdrop">
	<div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
		<h3 id="login-title">임시 로그인</h3>
		<form class="login-form" onsubmit={onSubmit}>
			<label>
				아이디
				<input bind:value={loginId} placeholder="admin" autocomplete="username" />
			</label>
			<label>
				비밀번호
				<input
					type="password"
					bind:value={loginPassword}
					placeholder="1234"
					autocomplete="current-password"
				/>
			</label>

			{#if loginError}
				<p class="login-error">{loginError}</p>
			{/if}

			<div class="modal-actions">
				<button type="button" class="ghost-btn" onclick={onClose}>취소</button>
				<button type="submit" class="submit-btn">로그인</button>
			</div>
		</form>
	</div>
</div>

<style>
	/* Backdrop: 모달 배경 오버레이 */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: #11182766;
		display: grid;
		place-items: center;
		padding: 20px;
		z-index: 20;
	}

	/* Modal Container: 로그인 폼 박스 */
	.login-modal {
		width: min(420px, 100%);
		background: #ffffff;
		border: 2px solid #16181d;
		border-radius: 14px;
		padding: 20px;
		box-shadow: 0 18px 34px #0000002e;
	}

	/* Modal Title */
	.login-modal h3 {
		margin: 0 0 14px;
		font-size: 22px;
	}

	/* Form Layout */
	.login-form {
		display: grid;
		gap: 12px;
	}

	.login-form label {
		display: grid;
		gap: 6px;
		font-size: 14px;
		font-weight: 600;
	}

	.login-form input {
		height: 40px;
		border: 1px solid #9ca3af;
		border-radius: 8px;
		padding: 0 12px;
		font-size: 14px;
	}

	/* Error Message */
	.login-error {
		margin: 0;
		font-size: 13px;
		color: #dc2626;
	}

	/* Action Buttons */
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
