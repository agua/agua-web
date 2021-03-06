#!/usr/bin/perl -w

=head3 B<APPLICATION>     View.t
	
	PURPOSE

		DRIVE TESTS OF View.pm AND ASSOCIATED Conf::Yaml MODULES

    NOTES
    
        USES FILE COMPARISONS
        
=cut

use Test::More	tests => 45;

#### EXTERNAL MODULES
use Test::Differences;
use File::Compare;
use File::Copy "cp";
use Getopt::Long;

use FindBin qw($Bin);
use lib "$Bin/../../../lib";
BEGIN
{
    my $installdir = $ENV{'installdir'} || "/a";
    unshift(@INC, "$installdir/extlib/lib/perl5");
    unshift(@INC, "$installdir/extlib/lib/perl5/x86_64-linux-gnu-thread-multi/");
    unshift(@INC, "$installdir/lib");
    unshift(@INC, "$installdir/lib/external/lib/perl5");
}

#### CREATE OUTPUTS DIR
my $outputsdir = "$Bin/outputs";
`mkdir -p $outputsdir` if not -d $outputsdir;


#### INTERNAL MODULES
use Test::Web::View::Main;
use Web::View::Main;
use Conf::Yaml;

#### SET CONF FILE
my $installdir  =   $ENV{'installdir'} || "/a";
my $configfile    =   "$installdir/conf/config.yml";

#### SET $Bin
$Bin =~ s/^.+bin/$installdir\/t\/bin/;

#### SET DUMPFILE
#my $dumpfile    =   "$Bin/../../../dump/create.dump";
my $dumpfile            =   "$Bin/inputs/testuser.view.110610.dump";

my $sourcedir			=	"$Bin/inputs";
my $targetdir			=	"$Bin/outputs";

#### INPUT FILES
my $addtrack            =   "$sourcedir/trackData-add.json";
my $removetrack         =   "$sourcedir/trackData-remove.json";
my $addedfile           =   "$sourcedir/trackInfo-added.js";
my $removedfile         =   "$sourcedir/trackInfo-removed.js";
my $originalfile        =   "$sourcedir/trackInfo-original.js";
my $location            =   "$sourcedir/nethome/syoung/agua/Project1/Workflow9/jbrowse/test1";
my $originalinfofile    =   "$sourcedir/data/plugins/view/jbrowse/users/admin/Project1/View1/data/trackInfo.bkp.js";
my $addedinfofile       =   "$sourcedir/data/plugins/view/jbrowse/users/admin/Project1/View1/data/trackInfo-added.js";
my $sourcetracksdir		=	"$sourcedir/data/plugins/view/jbrowse/users/admin/Project1/View1/data/tracks";

#### OUTPUT FILES
my $inputfile           =   "$targetdir/trackInfo.js";
my $htmlroot            =   "$targetdir/data";
my $infofile            =   "$targetdir/data/plugins/view/jbrowse/users/admin/Project1/View1/data/trackInfo.js";
my $targettracksdir		=	"$targetdir/data/plugins/view/jbrowse/users/admin/Project1/View1/data/tracks";


my $logfile             =   "$Bin/outputs/view.log";

#### GET OPTIONS
my $log     =   2;
my $printlog    =   5;
my $help;
GetOptions (
    'log=i'     => \$log,
    'printlog=i'    => \$printlog,
    'help'          => \$help
) or die "No options specified. Try '--help'\n";
usage() if defined $help;

my $conf = Conf::Yaml->new(
	inputfile	=>	$configfile,
	backup		=>	1,
	separator	=>	"\t",
	spacer		=>	"\\s\+",
    logfile     =>  $logfile,
	log     =>  2,
	printlog    =>  2
);
my $object = Test::Web::View::Main->new({   
    conf        =>  $conf,
	log			=>	$log,
	printlog    =>  $printlog,
    #database    =>  "testuser",
    dumpfile    =>  $dumpfile,
    logfile     =>  $logfile,
    htmlroot    =>  $htmlroot,
    location    =>  $location,
    conf        =>  $conf,
    username    =>  "test",
    project     =>  "Project1",
    workflow    =>  "Workflow1"
});

#### SET UP TEST DB
$object->setUpTestDatabase();

#$object->testAddTrack ($originalfile, $inputfile, $addtrack, $addedfile);
#$object->testRemoveTrack ($originalfile, $inputfile, $removetrack, $removedfile);

$object->testAddViewFeature();

#my $json = {
#    "username"	=>	"admin",
#    "project"	=>  "Project1",
#    "workflow"	=>	"Workflow1",
#    "view"	    =>  "ViewX",
#    "username"	=>  "admin",
#    "sessionId"	=>  "9999999999.9999.999",
#    "mode"	    =>  "addView"
#};
#$object->testAddRemoveView($json);
#
#my $objectfeature1 = {
#    "username"	        =>	"admin",
#    "project"	        =>	"Project1",
#    "view"	            =>	"View1",
#    "sourceproject"	    =>	"Project1",
#    "sourceworkflow"	=>	"Workflow0",
#    "species"	        =>	"human",
#    "build"	            =>	"hg19",
#    "feature"	        =>	"ntHumChimp",
#    "location"	        =>	"/nethome/admin/agua/Project1/Workflow0/jbrowse/ntHumChimp",
#    "mode"	            =>	"addViewFeature"
#};
#
#$object->testRemoveViewFeature($objectfeature1);
#
#$object->testAddRemoveViewFeature($objectfeature1);
#
#my $objectfeature2 = {
#    "sourceproject"	=>	"Project1",
#    "sourceworkflow"=>	"Workflow0",
#    "species"	    =>	"human",
#    "build"	        =>	"hg19",
#    "feature"	    =>	"control1",
#    "project"	    =>	"Project1",
#    "view"	        =>	"View1",
#    "username"	    =>	"admin",
#    "location"      =>  "/nethome/admin/agua/Project1/Workflow0/jbrowse/control1"
#};
#$object->testAddRemoveViewFeature($objectfeature2);
#
#my $objectfeature3 = {
#    "sourceproject"	=>	"Project1",
#    "sourceworkflow"=>	"Workflow0",
#    "species"	    =>	"human",
#    "build"	        =>	"hg19",
#    "feature"	    =>	"control2",
#    "project"	    =>	"Project1",
#    "view"	        =>	"View1",
#    "username"	    =>	"admin",
#    "location"      =>  "/nethome/admin/agua/Project1/Workflow0/jbrowse/control2"
#};
#$object->testAddRemoveViewFeature($objectfeature3);
#

#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
#                                    SUBROUTINES
#:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

sub usage {
    print `perldoc $0`;
}
