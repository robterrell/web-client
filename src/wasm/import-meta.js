export function importMetaURL() {
	return import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
}
