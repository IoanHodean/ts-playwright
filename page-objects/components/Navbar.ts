import {Page, expect, Locator} from '@playwright/test';
import { AbstractPage } from '../AbstractPage';

export class Navbar extends AbstractPage{


readonly accountSummary: Locator;
readonly accountActivity: Locator;
readonly transferFunds: Locator;
readonly payBills: Locator;     
readonly myMoneyApp: Locator;
readonly onlineStatements: Locator;

constructor(page: Page) {
    super(page);
this.accountSummary = page.locator('#account_summary_tab');
this.accountActivity = page.locator('#account_activity_tab');
this.transferFunds = page.locator('#transfer_funds_tab');
this.payBills = page.locator('#pay_bills_tab');
this.myMoneyApp = page.locator('#money_map_tab');
this.onlineStatements = page.locator('#online_statements_tab');

}

async clickOnTab(tabName:string){
    switch(tabName) {
        case 'Account Summary':
            await this.accountSummary.click();
            break;
        case 'Account Activity':
            await this.accountActivity.click();
            break;
        case 'Transfer Funds':
            await this.transferFunds.click();
            break;
        case 'Pay Bills':
            await this.payBills.click();
            break;
        case 'My Money Map':
            await this.myMoneyApp.click();
            break;
        case 'Online Statements':
            await this.onlineStatements.click();
            break;
        default:
            throw new Error(`Tab ${tabName} not found`);

}
}

async captureNavbarState(activeTab: string) {
    await this.clickOnTab(activeTab);
    const navbar = await this.page.locator('.nav-tabs').screenshot();
    await expect(navbar).toMatchSnapshot(`navbar-${activeTab.toLowerCase().replace(' ', '-')}.png`);
}

async compareAllNavStates() {
    const tabs = [
        'Account Summary',
        'Account Activity',
        'Transfer Funds',
        'Pay Bills',
        'My Money Map',
        'Online Statements'
    ];

    for (const tab of tabs) {
        await this.captureNavbarState(tab);
        // Add wait for animation/transition to complete
        await this.page.waitForTimeout(500);
    }
}
}
