// @flow

type ProgressChunk =
	'hundred' | 'ninety' | 'eighty' | 'seventy' |
	'sixty' | 'fifty' | 'forty' | 'thirty' |
	'twenty' | 'ten' | 'under-ten' | 'zero';

export function findWordForProgress(maxProgress: number, currentProgress: number): ProgressChunk {
	const progress = currentProgress / maxProgress

	if (progress >= 1) {
		return 'hundred'
	}
	else if (progress >= 0.9) {
		return 'ninety'
	}
	else if (progress >= 0.8) {
		return 'eighty'
	}
	else if (progress >= 0.7) {
		return 'seventy'
	}
	else if (progress >= 0.6) {
		return 'sixty'
	}
	else if (progress >= 0.5) {
		return 'fifty'
	}
	else if (progress >= 0.4) {
		return 'forty'
	}
	else if (progress >= 0.3) {
		return 'thirty'
	}
	else if (progress >= 0.2) {
		return 'twenty'
	}
	else if (progress >= 0.1) {
		return 'ten'
	}
	else if (progress > 0) {
		return 'under-ten'
	}

	return 'zero'
}
