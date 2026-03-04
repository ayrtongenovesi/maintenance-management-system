'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">proyectoutn documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-174551400a723d56ab31614b4229ecc77372528f1d8c3b8836fd90b0d491bfee9d6148b63b1bf13d18f861acbc468f4ff1f109341b1c21dbf773cf7d8759587d"' : 'data-bs-target="#xs-components-links-module-AppModule-174551400a723d56ab31614b4229ecc77372528f1d8c3b8836fd90b0d491bfee9d6148b63b1bf13d18f861acbc468f4ff1f109341b1c21dbf773cf7d8759587d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-174551400a723d56ab31614b4229ecc77372528f1d8c3b8836fd90b0d491bfee9d6148b63b1bf13d18f861acbc468f4ff1f109341b1c21dbf773cf7d8759587d"' :
                                            'id="xs-components-links-module-AppModule-174551400a723d56ab31614b4229ecc77372528f1d8c3b8836fd90b0d491bfee9d6148b63b1bf13d18f861acbc468f4ff1f109341b1c21dbf773cf7d8759587d"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AyudaDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AyudaDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistorialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrdenTrabajoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdenTrabajoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PdfService.html" data-type="entity-link" >PdfService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActivoApi.html" data-type="entity-link" >ActivoApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiMessageResponse.html" data-type="entity-link" >ApiMessageResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthLoginResponse.html" data-type="entity-link" >AuthLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthRegisterResponse.html" data-type="entity-link" >AuthRegisterResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateOTPayload.html" data-type="entity-link" >CreateOTPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateOTResponse.html" data-type="entity-link" >CreateOTResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EdificioApi.html" data-type="entity-link" >EdificioApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginCredentials.html" data-type="entity-link" >LoginCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrdenTrabajo.html" data-type="entity-link" >OrdenTrabajo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PisoApi.html" data-type="entity-link" >PisoApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterPayload.html" data-type="entity-link" >RegisterPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectorApi.html" data-type="entity-link" >SectorApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TareaApi.html" data-type="entity-link" >TareaApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UbicacionApi.html" data-type="entity-link" >UbicacionApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UsuarioApi.html" data-type="entity-link" >UsuarioApi</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});