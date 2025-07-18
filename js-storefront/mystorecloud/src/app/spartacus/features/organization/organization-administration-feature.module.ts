import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from "@spartacus/core";
import { organizationTranslationChunksConfig, organizationTranslationsEn } from "@spartacus/organization/administration/assets";
import { AdministrationRootModule, ORGANIZATION_ADMINISTRATION_FEATURE } from "@spartacus/organization/administration/root";

@NgModule({
  declarations: [],
  imports: [
    AdministrationRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [ORGANIZATION_ADMINISTRATION_FEATURE]: {
        module: () =>
          import('./administration-wrapper.module').then((m) => m.AdministrationWrapperModule),
      },
    }
  }),
  provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: organizationTranslationsEn },
      chunks: organizationTranslationChunksConfig,
    },
  })
  ]
})
export class OrganizationAdministrationFeatureModule { }
