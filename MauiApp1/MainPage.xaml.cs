namespace MauiApp1
{
    public partial class MainPage : ContentPage
    {
        int count = 0;

        public MainPage()
        {
            InitializeComponent();
        }

        private void OnCurrencyButtonClicked(object sender, EventArgs e)
        {
            // Logik für Währungswechsel
            CurrencyPopup.IsVisible = !CurrencyPopup.IsVisible;

        }

        private void OnCurrencySelected(object sender, EventArgs e)
        {
            if (sender is ImageButton btn && btn.Source is FileImageSource img)
            {

                (sender as ImageButton).IsEnabled = false;


                (this.FindByName<ImageButton>("CurrencyButton")).Source = img.File;

                CurrencyPopup.IsVisible = false;
            }
        }
    }

}
