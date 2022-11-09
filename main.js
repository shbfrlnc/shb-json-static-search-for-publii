class SHBJSONStaticSearchForPublii {
	constructor(API, name, config) {
		this.API = API;
		this.name = name;
		this.config = config;
	}

	addInsertions() {
		this.API.addInsertion('customSearchInput', this.addSearchInput, 1, this);
		this.API.addInsertion('customSearchContent', this.addSearchContent, 1, this);
	}

	addSearchInput(rendererInstance, context) {
		let actionUrl = '';

		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			actionUrl = rendererInstance.globalContext.website.searchUrl;
		}

		let output = `<form action="${actionUrl}" class="search__form">
                     <input
                        class="search__input"
                        type="search"
                        name="${this.config.searchParam}"
                        placeholder="${this.config.searchPlaceholder}" 
                        aria-label="${this.config.searchPlaceholder}"
                        autofocus/>
						<button type="submit" class="search__button"><span>${this.config.searchSubmitLabel}</span></button>
                  </form>`;

		return output;
	}

	addSearchContent(rendererInstance, context) {
		let actionUrl = '';

		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			actionUrl = rendererInstance.globalContext.website.searchUrl;
		}

		let output = `
			<script type="text/javascript" src="https://unpkg.com/js-search@1.3.7/dist/umd/js-search.min.js"></script>

			<form 
				action="${actionUrl}" 
				class="search-page-form">
				<input
					type="search"
					name="${this.config.searchParam}"
					placeholder="${this.config.searchPlaceholder}"
					class="search-page-input"/>
				<button type="submit" class="search-page-button"><span>${this.config.searchSubmitLabel}</span></button>
			</form>

			<div id="js-search-results"></div>

			<script>
				(async function () {
					console.log("${this.config.jsonUrl}");
					console.log("${this.config.searchParam}");

					let url = "${this.config.jsonUrl}";
					let j = await fetch(url);
					let jsn = await j.json();
					
					let search = new JsSearch.Search('url');
					search.addIndex('title');
					search.addDocuments(jsn.items);
					
					const params = new URLSearchParams(window.location.search)
					let results = search.search(params.get("${this.config.searchParam}"));
					let elm = document.querySelector("#js-search-results");
					results.forEach((result)=>{
						console.log(result);
						elm.innerHTML += '<h5><a href="'+ result.url +'">' + result.title + '</a></h5><p>' + result.summary + '</p>'
					});
				})();
			</script>
		`;

		return output;
	}
}

module.exports = SHBJSONStaticSearchForPublii;
